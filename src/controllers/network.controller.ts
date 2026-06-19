import { Request, Response } from 'express';
import { NetworkService } from '../services/network.service';

export class NetworkController {
  private networkService = new NetworkService();

  getAll = async (req: Request, res: Response) => {
    const networks = await this.networkService.getAll();

    res.status(200).json({ networks });
  };

  getById = async (req: Request, res: Response) => {
    const network = await this.networkService.getById(
      Number(req.params.id)
    );

    res.status(200).json(network);
  };

  create = async (req: Request, res: Response) => {
    const network = await this.networkService.create(req.body);

    res.status(201).json(network);
  };

  update = async (req: Request, res: Response) => {
    const network = await this.networkService.update(
      Number(req.params.id),
      req.body
    );

    res.status(200).json(network);
  };

  delete = async (req: Request, res: Response) => {
    await this.networkService.delete(Number(req.params.id));

    res.status(200).json({
      message: 'Réseau supprimé',
    });
  };

  getMembers = async (req: Request, res: Response) => {
    const members = await this.networkService.getMembers(
      Number(req.params.id)
    );

    res.status(200).json({ members });
  };

  addMember = async (req: Request, res: Response) => {
    const result = await this.networkService.addMember(
      Number(req.params.id),
      req.body
    );

    res.status(200).json(result);
  };

  removeMember = async (req: Request, res: Response) => {
    const result = await this.networkService.removeMember(
      Number(req.params.network_id),
      Number(req.params.member_id)
    );

    res.status(200).json(result);
  };

  getCaches = async (req: Request, res: Response) => {
    const caches = await this.networkService.getCaches(
      Number(req.params.id),
      req.query.type_id
        ? Number(req.query.type_id)
        : undefined,
      req.query.state_id
        ? Number(req.query.state_id)
        : undefined
    );

    res.status(200).json({ caches });
  };
}