import { prismaClient } from '../Services/database.service'
import { logger } from '../Services/logger.service'
import { type createAdType } from './ads.schema'
import { ResponseObject, type GenericResponseObject } from '../Services/google.errors'

export class AdsService {
  constructor (
    public prisma = prismaClient.prisma,
  ) {  
    this.updateAd=this.updateAd.bind(this)
    this.getAd=this.getAd.bind(this)
    this.deleteAd=this.deleteAd.bind(this)  
    this.setInactive=this.setInactive.bind(this)
    this.setActive=this.setActive.bind(this)
    this.getAds=this.getAds.bind(this)
    this.createAd=this.createAd.bind(this)
  }
  async createAd <T>(data: createAdType & { photoUrl: string }): Promise<GenericResponseObject<T | null>> {
    try {
      const response = await this.prisma.ads.create({ data: { importance: data.importance, photoUrl: data.photoUrl, title: data.title, url: data.url, user: { connect: { id: data.usersId } } } })
      return new ResponseObject(null, true, response as T)
    } catch (error) {
      logger.error({ function: 'AdsService.createAd', error })
      return new ResponseObject(error, false, null)
    }
  }  
  async getAds  () {
    try {
      const response = await this.prisma.ads.findMany({})
      return new ResponseObject(null, true, response)
    } catch (error) {
      logger.error({ function: 'AdsService.getAds', error })
      return new ResponseObject(error, false, null)
    }
  }
  async setActive (id: string) {
    try {
      const result = await this.prisma.ads.update({ where: { id }, data: { isActive: true } })
      return new ResponseObject(null, true, result)
    } catch (error) {
      logger.error({ function: 'AdsService.setActive', error })
      return new ResponseObject(error, false, null)
    }
  }
  public setInactive = async (id: string) => {
    try {
      const result = await this.prisma.ads.update({ where: { id }, data: { isActive: false } })
      return new ResponseObject(null, true, result)
    } catch (error) {
      logger.error({ function: 'AdsService.setInactive', error })
      return new ResponseObject(error, false, null)
    }
  }
  public deleteAd = async (id: string) => {
    try {
      const response = await this.prisma.ads.delete({ where: { id } })
      return new ResponseObject(null, true, response)
    } catch (error) {
      logger.error({ function: 'AdsService.deleteAd', error })
      return new ResponseObject(error, false, null)
    }
  }
  async updateAd (data: any & { photoUrl: string }, id: string)  {
    try {
      const response = await this.prisma.ads.update({ where: { id }, data })
      return new ResponseObject(null, true, response)
    } catch (error) {
      logger.error({ function: 'AdsService.updateAd', error })
      return new ResponseObject(error, false, null)
    }
  }

  async getAd (id: string)  {
    try {
      const response = await this.prisma.ads.findUnique({ where: { id } })
      console.log(response, 'getAd')
      return new ResponseObject(null, true, response)
    } catch (error) {
      logger.error({ function: 'AdsService.getAd', error })
    }
  }

}
