import glob

#grab all jsons with glob
#loop over and open all jsons with json
#concat
#print to a new file

my_jsons = glob.glob("*.json")
agg_file = open("vocab_agg.json", 'w')
print("file mode",agg_file.mode)

aggregate = "["
for json in my_jsons:
	f = open(json)
	with open(json) as f:
		aggregate += f.read()
		aggregate += ","
	f.close()


aggregate += "]"
aggregate = "".join(aggregate.split("\n"))
agg_file.write(aggregate)
agg_file.close()
print("aggregate json file printed")
#print(aggregate)