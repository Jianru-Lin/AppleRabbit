# AppleRabbit

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

## Service

### Task

```javascript
{
	type: 'Task',
	status: ''		// current task status
}
```

### SmsChallenge

```javascript
{
	type: 'SmsChallenge',
	spPhoneNo: '',	// service provider that will 
	reqText: '',	// text that send to apple
	resCode: '',	// reservation code apple responded
	phoneNo: '',	// the phone number which sended the reqText
}
```
