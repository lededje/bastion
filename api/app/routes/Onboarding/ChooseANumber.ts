import type { RequestHandler } from 'express';
import knex from '../../services/knex';

interface ChooseANumberOnboardingStep {
  type: 'CHOOSE_A_NUMBER',
}

const ChooseANumber: RequestHandler<{}, ChooseANumberOnboardingStep> = async (req, res, next) => {
  const usersPhoneNumbers = await knex('phone_numbers')
    .where({ user_id: req.identity.id })
  
  if(usersPhoneNumbers.length === 0) {
    res.json({
      type: 'CHOOSE_A_NUMBER'
    });

    return;
  }

  next();
}

export default ChooseANumber;