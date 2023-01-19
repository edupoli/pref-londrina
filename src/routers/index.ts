/*##############################################################################
# File: index.ts                                                               #
# Project: typescript                                                          #
# Created Date: 2022-09-08 13:49:22                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-09-08 13:49:26                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

import { Request, Response, Router } from 'express';
import { create } from '../services/makeNFe';
export const router = Router();

router.post('/makeNFe', async (req: Request, res: Response) => {
  const { cmc, uf, senha } = req.body;
  if (!cmc)
    return res.status(500).json({ status: 404, error: 'CMC not found' });
  if (!uf) return res.status(404).json({ status: 404, error: 'UF not found' });
  if (!senha)
    return res.status(404).json({ status: 404, error: 'Senha not found' });
  const result = await create(cmc, uf, senha);
  if (result.statusCode === 200)
    res
      .status(200)
      .json({ status: 200, succsses: true, result: result.result });
  if (result.statusCode === 400)
    res.status(400).json({ status: 400, result: result.result });
});
