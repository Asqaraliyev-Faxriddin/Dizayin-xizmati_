import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import  {PrismaClient}  from '@prisma/client';
import { exit } from "process";


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit,OnModuleDestroy{

  private readonly logger = new Logger("Database")


  async onModuleInit() {
    try {
      await this.$connect()
      this.logger.log("Database connected successfully")

    } catch (error) {
      this.logger.error("Error connecting to database",error)
      exit(1)

    }
  }

  async onModuleDestroy() {
  try {
    await this.$disconnect()
    this.logger.log("Database disconnected successfully")
  } catch (error) {
    this.logger.error("Error disconnecting from database",error)
      exit(1)

  }
  }


}