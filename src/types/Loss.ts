import { LossType } from "./enums/LossType"

export type PregnancyLoss = {
	id:           string     
	animalId:     string     
	animalNumber: string     
	animalName:   string     
	lossType:     LossType     
	lossDate:     Date
	observation:  string     
}

