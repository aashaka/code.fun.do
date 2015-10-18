from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.template import Context, loader, Template
import os
import json
import requests
import urllib

BASE_DIR = os.path.dirname(__file__)

def json_response(func):
    """
    A decorator thats takes a view response and turns it
    into json. If a callback is added through GET or POST
    the response is JSONP.
    """
    def decorator(request, *args, **kwargs):
        objects = func(request, *args, **kwargs)
        if isinstance(objects, HttpResponse):
            return objects
        try:
            data = simplejson.dumps(objects)
            if 'callback' in request.REQUEST:
                # a jsonp response!
                data = '%s(%s);' % (request.REQUEST['callback'], data)
                return HttpResponse(data, "text/javascript")
        except:
            data = simplejson.dumps(str(objects))
        return HttpResponse(data, "application/json")
    return decorator

# @json_response
@csrf_exempt
def classify(request):
	try:	
		inp = request.POST
		name = inp['name']
		text = inp['text']
		# text = text.encode('ascii', 'ignore')
		
		data = {
			'text_list' : [text]
		}
		response = requests.post(
		    "https://api.monkeylearn.com/v2/classifiers/cl_oFKL5wft/classify/?",
		    data=json.dumps(data),
		    headers={'Authorization': 'Token 1569c380f608e8bd6610360be707dce71c7dcb6a',
	            'Content-Type': 'application/json'})
		response = json.loads(response.text)
		# print response.get('result', '')[0]
		res1 = response.get('result', '')[0]
		tags = [item['label'] for item in res1]

		args = {}
		args['readkey'] = 's7Rr3yE0GSvf'
		args['text'] = text
		args['output'] = 'json'
		args['version'] = '1.01'
		args = urllib.urlencode(args)
		url = "http://uclassify.com/browse/uClassify/Topics/ClassifyText?%s" % args
		# print url
		r = urllib.urlopen(url)
		# print r.read()
		response = json.loads(r.read())
		res2 = response.get('cls1', "")
		res2 = sorted(res2, key=res2.get, reverse=True)
		# print res2;
		result = {}
		result['success'] = 1;
		result['name'] = name;
		result['tags'] = tags;
		result['folder_name'] = res2[0];
		result['text'] = text;
		# with open('results/' + name, 'w') as outfile:
		# 	json.dump(result,outfile)
		# with open('results/final.json', 'ab') as outfile:
		# 	r = json.dumps(result) + '\n'
		# 	outfile.write(r)
		return JsonResponse(result)
	except:
		return JsonResponse( {"success" : 0} )

@csrf_exempt
def demo(request):
	var = {}
	var['data'] = "data"
	c = Context( var )
	t = loader.get_template("index.html")
	return HttpResponse( t.render(c) )