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

### call

```javascript
// request
{
    action: 'call',
    name: '',           // procedure name to call
    args: {},           // arguments
}

// response (failed)
{
    error: ''
}

// response (ok)
{
    result: {}          // returned from procedure
}
```

## Entity

### Plan

```javascript
{
	type: 'Plan',
	status: ''	        // start|stop
	storeList: [''],    // store name list
	accountList: [{     // account list
	    email: '',
	    password: ''
	}]
}
```

### Task

```javascript
{
    type: 'Task',
    planId: '',         // which plan this task belongs to
    status: '',         // progressing|success|failure
	storeName: ''
	storeUrl: ''
	appleId: ''
	password: ''
	governmentId: {
		firstName: '',	// can be undefined
		lastName: '',	// can be undefined
		type: '',		// CN.PRCID
		value: ''		// generate random one if not provided
	},
	productType: ''		// iPhone|Mac
}
```

### Worker

```javascript
{
	type: 'Worker',
	status: '',     // working|idling
	taskId: ''     // which task current working on
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

## API - for Manager

### startPlan()

Start target plan.

```javascript
// args
{
    planId: ''  // which plan you want to start
}

// result(ok)
{
}
```

### stopPlan()

Stop target plan.

```javascript
// args
{
    planId: ''  // which plan you want to stop
}

// result(ok)
{
}
```

### getTask()

## API - for Worker

### takeTask()

### updateTaskStatus()
