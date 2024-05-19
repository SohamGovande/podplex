import fairscale
import torch
import torch.optim as optim
import torch.nn.functional as F
from fairscale.nn.pipe.balance import balance_by_size

# define the model
model = torch.nn.Sequential(
            torch.nn.Linear(10, 10),
            torch.nn.ReLU(),
            torch.nn.Linear(10, 5)
        )

# define a sample input and use it to balance the model by size
sample = torch.randn(20, 10)
partitions = torch.cuda.device_count()
balance = balance_by_size(partitions, model, sample)

# create a piped model
model = fairscale.nn.Pipe(model, balance)
optimizer = optim.SGD(model.parameters(), lr=0.001)
loss_fn = F.nll_loss

# zero the gradients
optimizer.zero_grad()

# get the target and data
target = torch.randint(0,2,size=(20,1)).squeeze()
data = torch.randn(20, 10)

device = model.devices[0]
## outputs and target need to be on the same device
# forward step

# Training loop
num_epochs = 10
batch_size = 20

for epoch in range(num_epochs):
    print(f"Epoch {epoch+1}\n-------------------------------")
    
    for _ in range(100): # Assuming 100 batches per epoch
        # Generate random input data and target labels
        data = torch.randn(batch_size, 10)
        target = torch.randint(0, 5, size=(batch_size,))
        
        # Move data to the device of the first partition
        device = model.devices[0]
        data = data.to(device)
        target = target.to(device)

        # Forward pass
        optimizer.zero_grad()
        outputs = model(data)
        
        # Compute loss
        loss = loss_fn(outputs.to(device), target.to(device)) 
        
        # Backward pass and optimization step  
        loss.backward()
        optimizer.step()

        print(f"Epoch [{epoch+1}/{num_epochs}], Loss: {loss.item():.4f}")