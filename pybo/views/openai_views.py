from flask import Flask, request, Blueprint, jsonify
import os
import openai



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
        message = request.form["message"]

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
