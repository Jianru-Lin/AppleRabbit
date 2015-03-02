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
    id: ''  // which plan you want to start
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
    id: ''  // which plan you want to stop
}

// result(ok)
{
}
```

### getPlanSummary()

Get target plan summary.

```javascript
// args
{
    id: ''  // which plan you want to get summary
}

// result(ok)
{
    status: '',             // start|stop
    workerList: [],         // current working worker
    log: {                  // log summary
        all: {
            start: '',
            end: '',
            count: 0
        },
        ok: {
            start: '',
            end: '',
            count: 0
        },
        failure: {
            start: '',
            end: '',
            count: 0
        }
    }
}
```

### getPlanLog()

```javascript
// args
{
    id: '',
    filter: '',     // all|ok|failure
    start: '',      // start log id
    maxCount: 0,    // max count to return
}
```

## API - for Worker

### takeTask()

### reportTaskStatus()
