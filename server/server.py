from flask import Flask
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api, reqparse
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
			t = text
			print name
			data = {"text_list" : [text]}
			data = json.dumps(data)
			response = requests.post(
				"https://api.monkeylearn.com/v2/classifiers/cl_oFKL5wft/classify/?",
				data = data,
				headers = {'Authorization': 'Token 1569c380f608e8bd6610360be707dce71c7dcb6a',
				'Content-Type': 'application/json'
				#'Access-Control-Allow-Origin': 'x-requested-with',
				#'Access-Control-Allow-Origin': '*',
				#'Access-Control-Allow-Methods': ['POST', 'GET', 'OPTIONS', 'PUT']
				})

			response = json.loads(response.text)
			#print response
			res1 = response.get('result', '')[0]
			tags = [item['label'] for item in res1]
			data = {"texts" : [text]}
			args = {}
			#args['readkey'] = 'RUVeEnp8ktFY'
			#args['text'] = text
			#args['output'] = 'json'
			#args['version'] = '1.01'
			response = requests.post('https://api.uclassify.com/v1/uclassify/topics/classify', \
    		data = {"texts" : ["acbhcd"]}, \
    		headers = {'Authorization': 'Token ' + "s7Rr3yE0GSvf"})
			'''requests.post(
				"https://api.uclassify.com/v1/uclassify/topics/classify/?",
				data = data,
				headers = {'Authorization': 'Token s7Rr3yE0GSvf'})'''
			response = json.loads(response.text)
			print response
			#res2 = response.get('classification', '')[0]
			#print res2
			#res2 = sorted(res2, key=res2.get, reverse=True)
			result = {}
			result['success'] = 1
			result['name'] = name
			result['tags'] = tags
			#result['folder_name'] = res2[0]
			result['text'] = text
			return result

		except Exception as e:
			return {'error': str(e)}

api.add_resource(GetCategories, '/GetCategories')

if __name__ == '__main__':
	app.run(debug=True)
