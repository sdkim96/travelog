from flask import Flask, request, Blueprint, jsonify
import os
import openai
from io import BytesIO
from PIL import Image



bp = Blueprint('openai', __name__, url_prefix='/openai')

@bp.route("/submit", methods=["GET", "POST"])
def submit():
    if request.method == "POST":
        content = request.form["content"]

        openai.api_key = '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'
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"아래 내용을 카테고리별로 정리해줘 그리고 일정 관광지 관광내용만 나오게 출력해줘:\n\n{content}.\n",
            temperature=0.5,
            max_tokens=600,
            top_p=1.0,
            frequency_penalty=0.0,
            presence_penalty=0.0
        )

        summary = response.choices[0].text.strip()
        return jsonify(summary=summary)

    return "파일이 잘 전달되었습니다.", 400


@bp.route("/chatbot", methods=["GET", "POST"])
def chatbot():
    if request.method == "POST":
        message = request.json["message"]

        openai.api_key = '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'
        response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"{message}"},
            ],
        temperature=0.7,
        max_tokens=1000,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0
        )

        res = response['choices'][0]['message']['content']
        return jsonify(res=res)

    return "Invalid request method", 400


@bp.route("/dalle1", methods=["GET", "POST"]) #genenration
def dalle1():
    if request.method == "POST":
        message = request.json["message"]

        openai.api_key = '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'
        response = openai.Image.create(
            prompt=f"{message}",
            n=1,
            size="1024x1024"
        )
        image_url = response['data'][0]['url']

        return jsonify(image_url=image_url)

    return "Invalid request method", 400

from io import BytesIO

@bp.route("/dalle2", methods=["GET", "POST"])  # generation
def dalle2():
    if request.method == "POST":
        image1 = request.files["image1"]
        image2 = request.files["image2"]
        prompt = request.form["prompt"]

        def prepare_image(image):
            image = Image.open(image).convert('RGBA')
            max_size = 4 * 1024 * 1024  # 4 MB
            file_size = len(image.tobytes())

            if file_size > max_size:
                ratio = (max_size / file_size) ** 0.5
                new_size = (int(image.width * ratio), int(image.height * ratio))
                image = image.resize(new_size, Image.ANTIALIAS)
            return image

        png_image1 = prepare_image(image1)
        png_image2 = prepare_image(image2)

        # Save images as PNG in-memory
        image1_buffer = BytesIO()
        image2_buffer = BytesIO()

        png_image1.save(image1_buffer, format="PNG")
        png_image2.save(image2_buffer, format="PNG")

        image1_buffer.seek(0)
        image2_buffer.seek(0)

        openai.api_key = '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'
        response = openai.Image.create_edit(
            image=image1_buffer.read(),
            mask=image2_buffer.read(),
            prompt=f"{prompt}",
            n=1,
            size="1024x1024"
        )
        image_url = response['data'][0]['url']
        return image_url

    return "Invalid request method", 400




@bp.route("/dalle3", methods=["GET", "POST"])
def dalle3():
    if request.method == "POST":
        message = request.form["message"]

        openai.api_key = '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'
        response = openai.Image.create_variation(
            image=open("corgi_and_cat_paw.png", "rb"),
            n=1,
            size="1024x1024"
        )
        image_url = response['data'][0]['url']

    return "Invalid request method", 400


