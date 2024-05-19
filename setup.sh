sudo apt-get update
sudo apt-get install net-tools
sudo apt-get install smbclient
sudo apt-get install cifs-utils
runpodctl config --apiKey QB36FXUTFOC314A1NRS8KQPHK9SBJA8AEQEYQ8LD
python3 -m venv /workspace/envs/distribute
source /workspace/envs/distribute/bin/activate
cd /workspace/runpod-hackthon/parallel/
# sudo mkdir /mnt/training-data
