import glob

# grab all jsons with glob
# loop over and open all jsons with json
# concat
# print to a new file


class Aggregate:
	my_jsons = glob.glob("src/*.json")
	agg_file = open("master/vocab_agg.json", 'w')

	def create_aggregate(self):
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

	def handle_file(self):
		self.agg_file.write(self.aggregate)
		self.agg_file.close()

	def __init__(self):
		self.create_aggregate()
		self.handle_file()
		print("file mode", self.agg_file.mode)
		print("aggregate json file printed")


Aggregate()
