from flask import Flask, request
import utils
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Hi there! The server is running healthy.</p>"


@app.route("/api/predict-home-price", methods=["POST"])
def predict_home_price():
    req_body = request.get_json()
    total_sqft = float(req_body['total_sqft'])
    location = req_body['location']
    bhk = req_body['bhk']
    bath = req_body['bath']

    price = utils.estimate_price(location, total_sqft, bhk, bath)

    response = {"predicted_price": price}
    return response


@app.route("/api/locations", methods=["GET"])
def get_location_names():
    response = utils.get_locations()
    # Or your allowed origin
    return response


if __name__ == "__main__":
    print("Starting Flask Server for Home Price Prediction  🎉")
    utils.load_saved_artifacts()
    app.run(host="0.0.0.0", port=7001)
