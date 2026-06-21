import { Request, Response } from 'express';
import { NetworkService } from '../services/network.service';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors/AppError';

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
    const network = await this.networkService.create(req.user!, req.body);
    res.status(201).json(network);
  };

  update = async (req: Request, res: Response) => {
    const networkData = await this.networkService.getById(Number(req.params.id));
    if (!networkData) {
      throw new NotFoundError(`Le réseau avec l'identifiant ${req.params.id} n'existe pas`);
    }

    if (
      !await this.networkService.isOwner(Number(req.params.id), req.user!.id)
      && req.user!.role !== 'admin'
    ) {
      throw new ForbiddenError('Vous ne pouvez pas modifier ce réseau car vous n\'êtes pas le propriétaire');
    }

    const network = await this.networkService.update(
      Number(req.params.id),
      req.body
    );

    res.status(200).json(network);
  };

  delete = async (req: Request, res: Response) => {
    const networkData = await this.networkService.getById(Number(req.params.id));
    if (!networkData) {
      throw new NotFoundError(`Le réseau avec l'identifiant ${req.params.id} n'existe pas`);
    }

    if (
      !await this.networkService.isOwner(Number(req.params.id), req.user!.id)
      && req.user!.role !== 'admin'
    ) {
      throw new ForbiddenError('Vous ne pouvez pas supprimer ce réseau car vous n\'êtes pas le propriétaire');
    }

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
    const networkData = await this.networkService.getById(Number(req.params.id));
    if (!networkData) {
      throw new NotFoundError(`Le réseau avec l'identifiant ${req.params.id} n'existe pas`);
    }

    if (
      !await this.networkService.isOwner(Number(req.params.id), req.user!.id)
      && req.user!.role !== 'admin'
    ) {
      throw new ForbiddenError('Vous ne pouvez pas ajouter de membre car vous n\'êtes pas le propriétaire du réseau');
    }

    const result = await this.networkService.addMember(
      Number(req.params.id),
      req.body
    );

    res.status(200).json({
      message: 'Membre ajouté',
      ...result
    });
  };

  removeMember = async (req: Request, res: Response) => {
    if (
      !await this.networkService.isOwner(Number(req.params.network_id), req.user!.id)
      && req.user!.role !== 'admin'
    ) {
      throw new ForbiddenError('Vous ne pouvez pas supprimer de membre car vous n\'êtes pas le propriétaire du réseau');
    }

    const result = await this.networkService.removeMember(
      Number(req.params.network_id),
      Number(req.params.member_id)
    );

    res.status(200).json({
      message: 'Membre supprimé',
      ...result
    });
  };

  getCaches = async (req: Request, res: Response) => {
    if (
      !await this.networkService.isMember(Number(req.params.id), req.user!.id)
      && req.user!.role !== 'admin'
    ) {
      throw new ForbiddenError('Vous ne pouvez pas accéder aux caches de ce réseau car vous n\'êtes pas membre');
    }

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