import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';



@Injectable()
export class RedisService implements OnModuleInit{
  private client:Redis;

  onModuleInit() {
    this.client =  new Redis(process.env.REDIS_URL as string,{
      tls:{}
    });

    this.client.on('connect',()=> console.log('Redis connected successfully'));
    this.client.on('error',(err)=> console.error('Redis connection error',err));

  }

  async set(key:string,code:string,ttl:number){
    return this.client.set(key,code,'EX',ttl);
  }

  async get(key:string){
    return this.client.get(key);
  }

  async del(key:string){
    return this.client.del(key)
  }


}
