### Safe&Sound project

<br>

**Auth flow**

- user registers for the api -> POST
- api generates an api key for user
- user keep the api key

<br>

**Track Flow**

- generate qr code for put request -> PUT /citizen/location/nic?key=wsEd34sDtzZx23Vd
- user scan qr code
- access device location -> expo location
- create PUT body using lat long -> {lat, long}
- PUT the body to relevant PUT endpoint in qr code

<br>

**Report FLow**

- PHI enter COVID report status -> positive/negetive
- PHI enter user past status -> deceased: true/false, recovered: true/false
- create PUT body and append nic of the user
- PUT the request -> PUT /citizens/status/nic?key=fsEe38sHtzKx23Vd

<br>

**Detection Flow**

- system search for COVID status positive users
- display filtered users to CDC
- CDC can collect user data via GET /citizens/contacts/:nid?key=OtEdQ4s7tzPx221R

<br>
