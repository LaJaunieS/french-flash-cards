import glob
import os


class Concatenate():
	'''grabs all jsons in src directory with glob
	loop over and open all jsons with json
	concat to a variable
	 print variable to a new file in master dir
	 script must be located in parent directory of src and master
	'''

	my_jsons = sorted(glob.glob("src/*.json"))
	agg_file = open("../public/json/master/vocab_agg.json", 'w')


	def create_aggregate(self):
		#print(self.my_jsons)
		self.aggregate = "["

		for json in self.my_jsons:
			f = open(json)
			with open(json) as f:
				self.aggregate += f.read()
				self.aggregate += ","
			f.close()
		self.aggregate += "]"
		# minifies output
		self.aggregate = "".join(self.aggregate.split("\n"))
		self.aggregate = "".join(self.aggregate.split("  "))


	def handle_file(self):
		self.agg_file.write(self.aggregate)
		self.agg_file.close()
		self.new_file_size = os.stat("../public/json/master/vocab_agg.json").st_size

	def __init__(self):
		self.create_aggregate()
		self.handle_file()
		print("aggregate json file printed")
		print("new file size:", self.new_file_size/1000, "KB")


Concatenate()
