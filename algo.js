const prismaClient = require("./dist/Services/database.service").prismaClient
prismaClient.prisma.dataConfig.findMany({}).then(r=>console.log(r,"ccc"))