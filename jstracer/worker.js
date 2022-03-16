import RayTracer from './tracer.js';
import { Scene } from './scene.js';

self.addEventListener('message', function (msg) {
    var data = msg.data;
    console.log(data);
    switch (data.command) {
        case 'start':
            console.log('Starting trace...');
            let tracer = new RayTracer(data.width, data.height);
            let scene = Scene.Parse(data.scene);
            tracer.trace(scene, (y, row, step) => self.postMessage({ message: 'row', y: y, row: row, step: step }));
            self.close();
            self.postMessage({ message: 'done' });
            break;
        // case 'stop':
        //     console.log('Stopping trace.');
        //     self.close();
        //     break;
    }
});
