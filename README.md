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

## Action Protocol

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

### view

```javascript
// request
{
	action: 'view',
	name: ''
	// different view defines defferent arguments
}

// response (failed)
{
	error: ''
}

// response (ok)
{
    // different view defines different response
}
```

### update

```javascript
// request
{
	action: 'update',
	name: ''
	// different update defines defferent arguments
}

// response (failed)
{
	error: ''
}

// response (ok)
{
    // different update defines different response
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
	status: ''	        // started|stopped
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
    status: '',         // progressing|success|failure|canceled
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
	name: '',       // worker name
	group: ''       // group name belongs to
}
```

### SmsChallenge

```javascript
{
	type: 'SmsChallenge',
	
	// worker provide
	spPhoneNo: '',	// service provider phone number
	reqText: '',	// text to send

	// manager provide
	status: '',     // progressing|success|failure
	resCode: '',	// reservation code apple responded
	phoneNo: '',	// the phone number which sended the reqText
}
```

## View

### StartedPlan

```javascript
// request
{
	action: 'view',
    name: 'StartedPlan'
}

// response
{
    list: []    // started plan list, just summary
}
```

### PlanSummary

View target plan summary.

```javascript
// request
{
	action: 'view',
    name: 'PlanSummary',
    planId: ''  // which plan you want to get summary
}

// response (ok)
{
    id: '',                 // plan id
    status: '',             // started|stopped
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

### PlanLog

```javascript
// request
{
    action: 'view',
    name: 'PlanLog',
    planId: '',     // plan id
    kind: '',       // all|ok|failure
    start: '',      // start log id
    maxCount: 0,    // max count to return
}

// response (ok)
{
    planId: '',     // plan id
    logList: [{
        id: '',     // log id
        kind: '',   // ok|failure
        task: {},   // task - see 'Task' entity
        worker: {}, // worker- see 'Worker' entity
    }]
}
```

## Update

### planStatus

```javascript
// request
{
    action: 'update',
    name: 'planStatus',
    planId: '',
    value: ''               // started|stopped
}

// response (ok)
{
}
```

### workerStatus

```javascript
// request
{
    workerId: '',
    value: ''
}

// response (ok)
{
}
```
