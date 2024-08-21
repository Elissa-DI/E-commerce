import Stripe from "stripe";
import prisma from '../utils/database.js'

const stripe = new Stripe(process)