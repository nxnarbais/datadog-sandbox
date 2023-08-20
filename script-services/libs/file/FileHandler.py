import os.path  
import json

from libs.file.const import DATA_FOLDER

class FileHandler:
  def __init__(self, subfolder = None):
    print("Init FileHandler: dataFolder:{}".format(DATA_FOLDER))
    self.rootDataFolder = DATA_FOLDER
    self.subfolder = subfolder # Usually the datacenter and the org_id

  def _getDataFolderPath(self, subfolder):
    dataFolder = self.rootDataFolder
    if(self.subfolder is not None):
      dataFolder = self.rootDataFolder + self.subfolder + '/'
    if(subfolder is not None):
      dataFolder = self.rootDataFolder + subfolder + '/'
    if(not os.path.exists(dataFolder)):
      os.mkdir(dataFolder)
    return dataFolder

  def writeStringToFile(self, filename, data, subfolder = None):
    dataFolder = self._getDataFolderPath(subfolder)
    with open("{}{}".format(dataFolder, filename), 'a') as outfile:
      outfile.write(data)

  def writeJSONToFile(self, filename, data, subfolder = None):
    dataFolder = self._getDataFolderPath(subfolder)
    with open("{}{}".format(dataFolder, filename), 'w+') as outfile:
      json.dump(data, outfile)

  def readJSONFromFile(self, filename, subfolder = None):
    dataFolder = self._getDataFolderPath(subfolder)
    with open("{}{}".format(dataFolder, filename)) as json_file:
      return json.load(json_file)

  def isFileAvailable(self, filename, subfolder = None):
    dataFolder = self._getDataFolderPath(subfolder)
    if os.path.isfile("{}{}".format(dataFolder, filename)):
      return True
    else:
      return False
