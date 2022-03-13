import RayTracer from './tracer.js';

self.addEventListener('message', function (msg) {
    var data = msg.data;
    console.log(data);
    switch (data.command) {
        case 'start':
            console.log('Starting trace...');
            let tracer = new RayTracer(data.width, data.height);
            tracer.trace((y, row, step) => self.postMessage({ message: 'row', y: y, row: row, step: step }));
            self.close();
            break;
        // case 'stop':
        //     console.log('Stopping trace.');
        //     self.close();
        //     break;
    }
});
