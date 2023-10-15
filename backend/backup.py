@app.route('/process_image', methods=['POST'])
def process_image():
    image_uri = json.loads(request.data)['image']
    prompt = json.loads(request.data)['prompt']
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
        image_uri = json.loads(request.data)['image']
        prompt = json.loads(request.data)['prompt']

        os.environ["REPLICATE_API_TOKEN"] = "r8_Sfo9ynvvLv3yDG9JF8gp5xLqWaG8TU02K2AML"

        try:
            output = replicate.run(
                "stability-ai/stable-diffusion-img2img:15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d",
                input={
                    "prompt": prompt,
                    "image": image_uri,
                    "num_inference_steps": 25
                }
            )

            return jsonify({"output": output})
        except Exception as e:
            return jsonify({"error": str(e)}), 500