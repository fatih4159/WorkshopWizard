import { Response } from 'express';
import { WorkshopModel } from '../models/Workshop.js';
import { AuthRequest } from '../middleware/auth.js';

export class WorkshopController {
  static async create(req: AuthRequest, res: Response) {
    try {
      console.log('📝 Create workshop request:', { userId: req.userId, body: req.body });

      const { title, data } = req.body;

      if (!title) {
        console.log('❌ Missing title');
        return res.status(400).json({ error: 'Title is required' });
      }

      const workshopData = data || JSON.stringify({
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        data: {
          currentStep: 1,
          customer: {},
          tools: [],
          processes: [],
          automationScenarios: [],
          selectedPackage: null,
          hourlyRate: 45,
          notes: '',
          actionItems: [],
        },
      });

      console.log('💾 Creating workshop in database...');
      const workshop = await WorkshopModel.create(req.userId!, title, workshopData);
      console.log('✅ Workshop created successfully:', workshop.id);

      res.status(201).json({ workshop });
    } catch (error) {
      console.error('❌ Create workshop error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      const workshops = await WorkshopModel.findByUserId(req.userId!);

      // Parse data for each workshop
      const workshopsWithParsedData = workshops.map(w => ({
        ...w,
        data: JSON.parse(w.data),
      }));

      res.json({ workshops: workshopsWithParsedData });
    } catch (error) {
      console.error('Get workshops error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async getById(req: AuthRequest, res: Response) {
    try {
      const workshopId = parseInt(req.params.id);

      if (isNaN(workshopId)) {
        return res.status(400).json({ error: 'Invalid workshop ID' });
      }

      const workshop = await WorkshopModel.findByUserAndId(req.userId!, workshopId);

      if (!workshop) {
        return res.status(404).json({ error: 'Workshop not found' });
      }

      // Update last accessed time
      await WorkshopModel.updateLastAccessed(workshopId, req.userId!);

      res.json({
        workshop: {
          ...workshop,
          data: JSON.parse(workshop.data),
        },
      });
    } catch (error) {
      console.error('Get workshop error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const workshopId = parseInt(req.params.id);

      if (isNaN(workshopId)) {
        return res.status(400).json({ error: 'Invalid workshop ID' });
      }

      const { title, data, currentStep, isCompleted } = req.body;

      const updateData: any = {};

      if (title !== undefined) updateData.title = title;
      if (data !== undefined) updateData.data = JSON.stringify(data);
      if (currentStep !== undefined) updateData.current_step = currentStep;
      if (isCompleted !== undefined) updateData.is_completed = isCompleted;

      const workshop = await WorkshopModel.update(workshopId, req.userId!, updateData);

      if (!workshop) {
        return res.status(404).json({ error: 'Workshop not found' });
      }

      res.json({
        workshop: {
          ...workshop,
          data: JSON.parse(workshop.data),
        },
      });
    } catch (error) {
      console.error('Update workshop error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const workshopId = parseInt(req.params.id);

      if (isNaN(workshopId)) {
        return res.status(400).json({ error: 'Invalid workshop ID' });
      }

      const deleted = await WorkshopModel.delete(workshopId, req.userId!);

      if (!deleted) {
        return res.status(404).json({ error: 'Workshop not found' });
      }

      res.json({ message: 'Workshop deleted successfully' });
    } catch (error) {
      console.error('Delete workshop error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
