from flask import Flask
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse
from operator import itemgetter
import os
import json
import requests
import urllib

app = Flask(__name__)
api = Api(app)
CORS(app)

class GetCategories(Resource):
	def post(self):
		try:
			parser = reqparse.RequestParser()
			parser.add_argument('name', type=str, help='Name of the file')
			parser.add_argument('text', help='Content of the file')
			req_args = parser.parse_args()
			name = req_args['name']
			text = req_args['text']
			txts = text
			print name
			data = {"text_list" : [text]}
			data = json.dumps(data)
			response = requests.post(
				"https://api.monkeylearn.com/v2/classifiers/cl_oFKL5wft/classify/?",
				data = data,
				headers = {'Authorization': 'Token 1569c380f608e8bd6610360be707dce71c7dcb6a',
				'Content-Type': 'application/json'
				})

			response = json.loads(response.text)
			print response
			res1 = response.get('result', '')[0]
			tags = [item['label'] for item in res1]
			data = {"texts" : [text]}
			data = json.dumps(data)
			response = requests.post(
				"https://api.uclassify.com/v1/uclassify/topics/classify??",
				data = data,
				headers = {'Authorization': 'Token RUVeEnp8ktFY'
				})
			response = json.loads(response.text)
			all_responses = response[0].get('classification')
			sortedlist = sorted(all_responses, key=itemgetter('p'), reverse=True)
			cat = sortedlist[0].get('className')
			result = {}
			result['folder_name']= cat.lower()
			result['success'] = 1
			result['name'] = name
			result['tags'] = tags
			result['text'] = text
			return result

		except Exception as e:
			return {'error': str(e)}

api.add_resource(GetCategories, '/GetCategories')

if __name__ == '__main__':
	app.run(debug=True)
