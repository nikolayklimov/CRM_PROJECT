"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const core_2 = require("@nestjs/core");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        const reflector = app.get(core_2.Reflector);
        await app.listen(3000);
        console.log('App is running on http://localhost:3000');
    }
    catch (error) {
        console.error('Error starting the app:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map