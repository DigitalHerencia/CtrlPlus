# Python API documentation for CannaTech/CtrlPlus

API Endpoints: 5

1. Install the Python client [docs](https://www.gradio.app/guides/getting-started-with-the-python-client) if you don't already have it installed.

```bash
pip install gradio_client
```

2. Find the API endpoint below corresponding to your desired function in the app. Copy the code snippet, replacing the placeholder values with your own input data. If this is a private Space, you may need to pass your Hugging Face token as well. [Read more](https://www.gradio.app/guides/getting-started-with-the-python-client#connecting-to-a-hugging-face-space).

### API Name: /on_make_change

```python
from gradio_client import Client

client = Client("CannaTech/CtrlPlus")
result = client.predict(
	make="AM General",
	api_name="/on_make_change",
)
print(result)
```

Accepts 1 parameter:

make:

- Type: Literal['AM General', 'ATK', 'Acura', 'Alfa Romeo', 'American Ironhorse', 'American Lafrance', 'Aprilia', 'Arctic CAT', 'Argo', 'Aston Martin', 'Audi', 'Autocar Llc.', 'Avanti', 'BIG DOG', 'BMW', 'Bentley', 'Bertone', 'Beta', 'Bimota', 'Blue Bird', 'Bobcat', 'Bombardier', 'Buell', 'Bugatti', 'Buick', 'CAN-AM', 'CUB Cadet', 'Cadillac', 'Cannondale', 'Chance Coach Transit BUS', 'Chevrolet', 'Chrysler', 'Cobra', 'Coda', 'Country Coach Motorhome', 'Crane Carrier', 'Daewoo', 'Dodge', 'Ducati', 'E-TON', 'EL Dorado', 'Ferrari', 'Fiat', 'Fisker', 'Ford', 'Freightliner', 'GAS GAS', 'GMC', 'Gillig', 'HM', 'Harley Davidson', 'Hino', 'Honda', 'Hummer', 'Husaberg', 'Husqvarna', 'Hyosung', 'Hyundai', 'IC Corporation', 'Indian', 'Infiniti', 'International', 'Isuzu', 'Jaguar', 'Jeep', 'John Deere', 'KIA', 'KTM', 'Kasea', 'Kawasaki', 'Kenworth', 'Kubota', 'Kymco', 'LEM', 'Laforza', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'MV Agusta', 'Mack', 'Maserati', 'Maybach', 'Mazda', 'Mclaren', 'Mercedes-Benz', 'Mercury', 'Mini', 'Mitsubishi', 'Mitsubishi Fuso', 'Morgan', 'Moto Guzzi', 'Motor Coach Industries', 'NEW Flyer', 'Nash', 'Nissan', 'Nova BUS Corporation', 'Oldsmobile', 'Orion BUS', 'Oshkosh Motor Truck CO.', 'Ottawa', 'Panoz', 'Peterbilt', 'Peugeot', 'Piaggio', 'Pierce Mfg. Inc.', 'Plymouth', 'Polaris', 'Pontiac', 'Porsche', 'Qvale', 'RAM', 'Renault', 'Rolls Royce', 'Rover', 'SEA-DOO', 'SKI-DOO', 'SRT', 'Saab', 'Saleen', 'Saturn', 'Scion', 'Seat', 'Smart', 'Sterling', 'Sterling Truck', 'Subaru', 'Suzuki', 'TM', 'Tesla', 'Toyota', 'Triumph', 'UD', 'VPG', 'Vento', 'Vespa', 'Victory', 'Volkswagen', 'Volvo', 'Western RV', 'Western Star', 'Workhorse', 'Yamaha']
- Default: "AM General"
- The input value that is provided in the Make Dropdown component.

Returns tuple of 3 elements:

[0]: - Type: Literal['Hummer']

- The output value that appears in the "Model" Dropdown component.

[1]: - Type: Literal['2001']

- The output value that appears in the "Year" Dropdown component.

[2]: - Type: Literal['Base']

- The output value that appears in the "Trim / Series" Dropdown component.

### API Name: /on_model_change

```python
from gradio_client import Client

client = Client("CannaTech/CtrlPlus")
result = client.predict(
	make="AM General",
	model="Hummer",
	api_name="/on_model_change",
)
print(result)
```

Accepts 2 parameters:

make:

- Type: Literal['AM General', 'ATK', 'Acura', 'Alfa Romeo', 'American Ironhorse', 'American Lafrance', 'Aprilia', 'Arctic CAT', 'Argo', 'Aston Martin', 'Audi', 'Autocar Llc.', 'Avanti', 'BIG DOG', 'BMW', 'Bentley', 'Bertone', 'Beta', 'Bimota', 'Blue Bird', 'Bobcat', 'Bombardier', 'Buell', 'Bugatti', 'Buick', 'CAN-AM', 'CUB Cadet', 'Cadillac', 'Cannondale', 'Chance Coach Transit BUS', 'Chevrolet', 'Chrysler', 'Cobra', 'Coda', 'Country Coach Motorhome', 'Crane Carrier', 'Daewoo', 'Dodge', 'Ducati', 'E-TON', 'EL Dorado', 'Ferrari', 'Fiat', 'Fisker', 'Ford', 'Freightliner', 'GAS GAS', 'GMC', 'Gillig', 'HM', 'Harley Davidson', 'Hino', 'Honda', 'Hummer', 'Husaberg', 'Husqvarna', 'Hyosung', 'Hyundai', 'IC Corporation', 'Indian', 'Infiniti', 'International', 'Isuzu', 'Jaguar', 'Jeep', 'John Deere', 'KIA', 'KTM', 'Kasea', 'Kawasaki', 'Kenworth', 'Kubota', 'Kymco', 'LEM', 'Laforza', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'MV Agusta', 'Mack', 'Maserati', 'Maybach', 'Mazda', 'Mclaren', 'Mercedes-Benz', 'Mercury', 'Mini', 'Mitsubishi', 'Mitsubishi Fuso', 'Morgan', 'Moto Guzzi', 'Motor Coach Industries', 'NEW Flyer', 'Nash', 'Nissan', 'Nova BUS Corporation', 'Oldsmobile', 'Orion BUS', 'Oshkosh Motor Truck CO.', 'Ottawa', 'Panoz', 'Peterbilt', 'Peugeot', 'Piaggio', 'Pierce Mfg. Inc.', 'Plymouth', 'Polaris', 'Pontiac', 'Porsche', 'Qvale', 'RAM', 'Renault', 'Rolls Royce', 'Rover', 'SEA-DOO', 'SKI-DOO', 'SRT', 'Saab', 'Saleen', 'Saturn', 'Scion', 'Seat', 'Smart', 'Sterling', 'Sterling Truck', 'Subaru', 'Suzuki', 'TM', 'Tesla', 'Toyota', 'Triumph', 'UD', 'VPG', 'Vento', 'Vespa', 'Victory', 'Volkswagen', 'Volvo', 'Western RV', 'Western Star', 'Workhorse', 'Yamaha']
- Default: "AM General"
- The input value that is provided in the Make Dropdown component.

model:

- Type: Literal['Hummer']
- Default: "Hummer"
- The input value that is provided in the Model Dropdown component.

Returns tuple of 2 elements:

[0]: - Type: Literal['2001']

- The output value that appears in the "Year" Dropdown component.

[1]: - Type: Literal['Base']

- The output value that appears in the "Trim / Series" Dropdown component.

### API Name: /on_year_change

```python
from gradio_client import Client

client = Client("CannaTech/CtrlPlus")
result = client.predict(
	make="AM General",
	model="Hummer",
	year="2001",
	api_name="/on_year_change",
)
print(result)
```

Accepts 3 parameters:

make:

- Type: Literal['AM General', 'ATK', 'Acura', 'Alfa Romeo', 'American Ironhorse', 'American Lafrance', 'Aprilia', 'Arctic CAT', 'Argo', 'Aston Martin', 'Audi', 'Autocar Llc.', 'Avanti', 'BIG DOG', 'BMW', 'Bentley', 'Bertone', 'Beta', 'Bimota', 'Blue Bird', 'Bobcat', 'Bombardier', 'Buell', 'Bugatti', 'Buick', 'CAN-AM', 'CUB Cadet', 'Cadillac', 'Cannondale', 'Chance Coach Transit BUS', 'Chevrolet', 'Chrysler', 'Cobra', 'Coda', 'Country Coach Motorhome', 'Crane Carrier', 'Daewoo', 'Dodge', 'Ducati', 'E-TON', 'EL Dorado', 'Ferrari', 'Fiat', 'Fisker', 'Ford', 'Freightliner', 'GAS GAS', 'GMC', 'Gillig', 'HM', 'Harley Davidson', 'Hino', 'Honda', 'Hummer', 'Husaberg', 'Husqvarna', 'Hyosung', 'Hyundai', 'IC Corporation', 'Indian', 'Infiniti', 'International', 'Isuzu', 'Jaguar', 'Jeep', 'John Deere', 'KIA', 'KTM', 'Kasea', 'Kawasaki', 'Kenworth', 'Kubota', 'Kymco', 'LEM', 'Laforza', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'MV Agusta', 'Mack', 'Maserati', 'Maybach', 'Mazda', 'Mclaren', 'Mercedes-Benz', 'Mercury', 'Mini', 'Mitsubishi', 'Mitsubishi Fuso', 'Morgan', 'Moto Guzzi', 'Motor Coach Industries', 'NEW Flyer', 'Nash', 'Nissan', 'Nova BUS Corporation', 'Oldsmobile', 'Orion BUS', 'Oshkosh Motor Truck CO.', 'Ottawa', 'Panoz', 'Peterbilt', 'Peugeot', 'Piaggio', 'Pierce Mfg. Inc.', 'Plymouth', 'Polaris', 'Pontiac', 'Porsche', 'Qvale', 'RAM', 'Renault', 'Rolls Royce', 'Rover', 'SEA-DOO', 'SKI-DOO', 'SRT', 'Saab', 'Saleen', 'Saturn', 'Scion', 'Seat', 'Smart', 'Sterling', 'Sterling Truck', 'Subaru', 'Suzuki', 'TM', 'Tesla', 'Toyota', 'Triumph', 'UD', 'VPG', 'Vento', 'Vespa', 'Victory', 'Volkswagen', 'Volvo', 'Western RV', 'Western Star', 'Workhorse', 'Yamaha']
- Default: "AM General"
- The input value that is provided in the Make Dropdown component.

model:

- Type: Literal['Hummer']
- Default: "Hummer"
- The input value that is provided in the Model Dropdown component.

year:

- Type: Literal['2001']
- Default: "2001"
- The input value that is provided in the Year Dropdown component.

Returns 1 element:

- Type: Literal['Base']
- The output value that appears in the "Trim / Series" Dropdown component.

### API Name: /get_wrap_description

```python
from gradio_client import Client

client = Client("CannaTech/CtrlPlus")
result = client.predict(
	wrap_name="Arctic Gloss Satin Wrap",
	api_name="/get_wrap_description",
)
print(result)
```

Accepts 1 parameter:

wrap_name:

- Type: Literal['Arctic Gloss Satin Wrap', 'Midnight Stealth Matte Wrap', 'CTRL+', 'Inferno']
- Default: "Arctic Gloss Satin Wrap"
- The input value that is provided in the Wrap Style Dropdown component.

Returns 1 element:

- Type: str
- The output value that appears in the "value_10" Markdown component.

### API Name: /generate_wrap_preview

```python
from gradio_client import Client

client = Client("CannaTech/CtrlPlus")
result = client.predict(
	make="AM General",
	model="Hummer",
	year="2001",
	trim="Base",
	wrap_name="Arctic Gloss Satin Wrap",
	api_name="/generate_wrap_preview",
)
print(result)
```

Accepts 5 parameters:

make:

- Type: Literal['AM General', 'ATK', 'Acura', 'Alfa Romeo', 'American Ironhorse', 'American Lafrance', 'Aprilia', 'Arctic CAT', 'Argo', 'Aston Martin', 'Audi', 'Autocar Llc.', 'Avanti', 'BIG DOG', 'BMW', 'Bentley', 'Bertone', 'Beta', 'Bimota', 'Blue Bird', 'Bobcat', 'Bombardier', 'Buell', 'Bugatti', 'Buick', 'CAN-AM', 'CUB Cadet', 'Cadillac', 'Cannondale', 'Chance Coach Transit BUS', 'Chevrolet', 'Chrysler', 'Cobra', 'Coda', 'Country Coach Motorhome', 'Crane Carrier', 'Daewoo', 'Dodge', 'Ducati', 'E-TON', 'EL Dorado', 'Ferrari', 'Fiat', 'Fisker', 'Ford', 'Freightliner', 'GAS GAS', 'GMC', 'Gillig', 'HM', 'Harley Davidson', 'Hino', 'Honda', 'Hummer', 'Husaberg', 'Husqvarna', 'Hyosung', 'Hyundai', 'IC Corporation', 'Indian', 'Infiniti', 'International', 'Isuzu', 'Jaguar', 'Jeep', 'John Deere', 'KIA', 'KTM', 'Kasea', 'Kawasaki', 'Kenworth', 'Kubota', 'Kymco', 'LEM', 'Laforza', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 'MV Agusta', 'Mack', 'Maserati', 'Maybach', 'Mazda', 'Mclaren', 'Mercedes-Benz', 'Mercury', 'Mini', 'Mitsubishi', 'Mitsubishi Fuso', 'Morgan', 'Moto Guzzi', 'Motor Coach Industries', 'NEW Flyer', 'Nash', 'Nissan', 'Nova BUS Corporation', 'Oldsmobile', 'Orion BUS', 'Oshkosh Motor Truck CO.', 'Ottawa', 'Panoz', 'Peterbilt', 'Peugeot', 'Piaggio', 'Pierce Mfg. Inc.', 'Plymouth', 'Polaris', 'Pontiac', 'Porsche', 'Qvale', 'RAM', 'Renault', 'Rolls Royce', 'Rover', 'SEA-DOO', 'SKI-DOO', 'SRT', 'Saab', 'Saleen', 'Saturn', 'Scion', 'Seat', 'Smart', 'Sterling', 'Sterling Truck', 'Subaru', 'Suzuki', 'TM', 'Tesla', 'Toyota', 'Triumph', 'UD', 'VPG', 'Vento', 'Vespa', 'Victory', 'Volkswagen', 'Volvo', 'Western RV', 'Western Star', 'Workhorse', 'Yamaha']
- Default: "AM General"
- The input value that is provided in the Make Dropdown component.

model:

- Type: Literal['Hummer']
- Default: "Hummer"
- The input value that is provided in the Model Dropdown component.

year:

- Type: Literal['2001']
- Default: "2001"
- The input value that is provided in the Year Dropdown component.

trim:

- Type: Literal['Base']
- Default: "Base"
- The input value that is provided in the Trim / Series Dropdown component.

wrap_name:

- Type: Literal['Arctic Gloss Satin Wrap', 'Midnight Stealth Matte Wrap', 'CTRL+', 'Inferno']
- Default: "Arctic Gloss Satin Wrap"
- The input value that is provided in the Wrap Style Dropdown component.

Returns tuple of 2 elements:

[0]: - Type: filepath

- The output value that appears in the "Generated Concept" Image component.

[1]: - Type: str

- The output value that appears in the "Prompt Used" Textbox component.
