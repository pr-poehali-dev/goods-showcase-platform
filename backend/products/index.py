"""
Управление товарами магазина: получение, создание, редактирование, удаление, загрузка фото.
"""
import os
import json
import uuid
import base64
import psycopg2
import boto3
from psycopg2.extras import RealDictCursor

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    body = {}
    if event.get("body"):
        try:
            body = json.loads(event["body"])
        except Exception:
            pass

    # GET /products — список товаров
    if method == "GET" and not path.endswith("/upload"):
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            f"SELECT * FROM {SCHEMA}.products WHERE is_active = true ORDER BY sort_order, id"
        )
        rows = cur.fetchall()
        conn.close()
        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"products": [dict(r) for r in rows]}),
        }

    # GET /products/all — все включая неактивные (для админки)
    if method == "GET" and path.endswith("/all"):
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(f"SELECT * FROM {SCHEMA}.products ORDER BY sort_order, id")
        rows = cur.fetchall()
        conn.close()
        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"products": [dict(r) for r in rows]}),
        }

    # POST /products — создать товар
    if method == "POST" and not path.endswith("/upload"):
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            f"""INSERT INTO {SCHEMA}.products
                (name, description, price, old_price, badge, category, image_url, sort_order, is_active)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING *""",
            (
                body.get("name", "Новый товар"),
                body.get("description", ""),
                body.get("price", 0),
                body.get("old_price"),
                body.get("badge"),
                body.get("category", "Другое"),
                body.get("image_url"),
                body.get("sort_order", 0),
                body.get("is_active", True),
            ),
        )
        row = dict(cur.fetchone())
        conn.commit()
        conn.close()
        return {
            "statusCode": 201,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"product": row}),
        }

    # PUT /products — обновить товар
    if method == "PUT" and not path.endswith("/upload"):
        product_id = body.get("id")
        conn = get_conn()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            f"""UPDATE {SCHEMA}.products
                SET name=%s, description=%s, price=%s, old_price=%s,
                    badge=%s, category=%s, image_url=%s, sort_order=%s, is_active=%s
                WHERE id=%s RETURNING *""",
            (
                body.get("name"),
                body.get("description"),
                body.get("price"),
                body.get("old_price"),
                body.get("badge"),
                body.get("category"),
                body.get("image_url"),
                body.get("sort_order", 0),
                body.get("is_active", True),
                product_id,
            ),
        )
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"product": dict(row)}),
        }

    # DELETE /products — удалить товар
    if method == "DELETE":
        product_id = body.get("id")
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {SCHEMA}.products WHERE id=%s", (product_id,))
        conn.commit()
        conn.close()
        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"ok": True}),
        }

    # POST /products/upload — загрузить фото
    if method == "POST" and path.endswith("/upload"):
        image_data = body.get("image")
        filename = body.get("filename", "photo.jpg")
        if not image_data:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "No image"})}

        if "," in image_data:
            image_data = image_data.split(",", 1)[1]
        raw = base64.b64decode(image_data)

        ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
        key = f"products/{uuid.uuid4()}.{ext}"
        content_type = f"image/{ext}" if ext != "jpg" else "image/jpeg"

        s3 = boto3.client(
            "s3",
            endpoint_url="https://bucket.poehali.dev",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        s3.put_object(Bucket="files", Key=key, Body=raw, ContentType=content_type)
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"

        return {
            "statusCode": 200,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"url": url}),
        }

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
