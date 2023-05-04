from flask import Flask, request, jsonify
from flask_cors import CORS
import stripe
import json
import os

app = Flask(__name__)
CORS(app)

stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')

@app.route('/api/airports', methods=['GET'])
def get_airports():
    with open('master-list.md', 'r') as file:
        airports = file.readlines()
    airports = [airport.strip() for airport in airports]
    return jsonify({'airports': airports}), 200

@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()
    airport = data.get('airport', '')

    if not airport:
        return jsonify({'error': 'Airport is required'}), 400

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'Airport Service: {airport}',
                    },
                    'unit_amount': 1000,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='https://example.com/cancel',
        )
        return jsonify({'id': session.id})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
