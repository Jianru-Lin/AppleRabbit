# AppleRabbit

## Architecture

### Roles

- Control Center
- Manager
- Worker Agency (optional)
- Worker

Wroker Agency is used to manage Wroker. It is optional, but life could be easier with it.

### JSON Server

Control Center sets up a JSON server for communication. Manager, Worker Agency and Worker can not talk to each other directly. Any cooperation between them must be achived via Control Center.

## Basic Protocol

### get
```javascript
// request
{
	action: 'get',
	id: ''
}

// response (failed)
{
	error: ''
}

// response (ok)
{
	target: {
		id: '',
		// ...
	}
}
```

### set

```javascript
// request
{
	action: 'set',
	target: {
		id: '',
		// ...
	}
}

// response (failed)
{
	error: ''
}

// response (ok)
{
	target: {
		id: '',
		// ...
	}
}
```

## Entity

### Task

```javascript
{
	type: 'Task',
	status: ''	        // start|stop
	storeList: [''],    // store name list
	accountList: [{     // account list
	    email: '',
	    password: ''
	}]
}
```

### Worker

```javascript
{
	type: 'Worker',
	status: ''	// working|idling
}
```

### SmsChallenge

```javascript
{
	type: 'SmsChallenge',
	
	// worker provide
	spPhoneNo: '',	// service provider phone number
	reqText: '',	// text to send

	// server provide
	status: '',	// progressing|success|failure
	resCode: '',	// reservation code apple responded
	phoneNo: '',	// the phone number which sended the reqText
}
```
