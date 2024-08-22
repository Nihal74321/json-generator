Data is generated using a collection of JSON files
[breeds, dates-times, dogs, humans, and walker-notes]
These each correspond to certain information about their objects

Running the script::
Currently there is no UI, this will be changed in the future,
instead a file will be downloaded as soon as the link is opened. This contains the generatedJsonArray and can be directly imported into a database using mongoimport

Configuring the script::
The # of collections in the array can be changed by adjusting the seed_count param of the GenerateJsonArray() function called at the very end of the script. The file downloads as "Test-System.json" but the name can be adjusted using the second a.SetAttribute() method call
  --EX::
    a.SetAttribute("download", <insert_file_name>)

Data Generation:
Data generation can be broken down into steps:
  1. fetch all json files from the dir and return in an array of varaiables
  2. Parse dogs with owners: create a dog object that has a linked randomly generated owner. Both uuids are created using js crypto.randomUUID()
  3. Parse walkers: walker names, UUIDs, and mobile numbers are consistent.
  4. Iterate through creating a "booked_walk" object consisting of a random walker from a generated array, and a dog from another generated array, adding a time, date, and     walker notes, X amount of times (configured by seed_count variable in the GenerateJsonArray method)
  5. create anchor tag, make link and encode generated array, and simulate userclick to download (this will be changed when UI is added)
