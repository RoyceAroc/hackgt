from flask import Flask, request, jsonify
import os
import replicate
from flask_cors import CORS
import json 
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

model = SentenceTransformer('all-MiniLM-L6-v2')

app = Flask(__name__)
CORS(app)

@app.route('/process_image', methods=['POST'])
def process_image():
    image_uri= json.loads(request.data)['image']
    prompt = json.loads(request.data)['prompt']
    prompt_before = json.loads(request.data)['prompt_before']
    os.environ["REPLICATE_API_TOKEN"] = "r8_Sfo9ynvvLv3yDG9JF8gp5xLqWaG8TU02K2AML"

    similarity_score = 0.2
    if prompt_before != "none":
        embeddings = model.encode([prompt, prompt_before])
        similarity_score = cosine_similarity([embeddings[0]], [embeddings[1]])[0][0]
       
    if image_uri == "none":
        try:
            output = replicate.run(
                "stability-ai/stable-diffusion:ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
                input={
                    "prompt": prompt
                }
            )
            return jsonify({"output": output})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        try:
            output = replicate.run(
                "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d",
                input={
                    "prompt": prompt,
                    "image": image_uri,
                    "num_inference_steps": 10       
                }
            )

            return jsonify({"output": output})
        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
