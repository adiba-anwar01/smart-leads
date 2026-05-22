import type { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import type { FilterQuery } from 'mongoose';
import { LeadModel } from '../models/lead.model';
import { AppError } from '../middleware/error.middleware';
import { generateCSV } from '../utils/csv.utils';
import type { AuthenticatedRequest, ILeadDocument, PaginationMeta } from '../types/index';

function buildOwnerFilter(req: AuthenticatedRequest): FilterQuery<ILeadDocument> {
  if (req.user!.role !== 'admin') {
    return { createdBy: req.user!.id };
  }
  
  if (typeof req.query.createdBy === 'string' && mongoose.Types.ObjectId.isValid(req.query.createdBy)) {
    return { createdBy: req.query.createdBy };
  }
  
  return {};
}

export async function createLead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, status, source, createdBy } = req.body as {
      name: string;
      email: string;
      status?: string;
      source: string;
      createdBy?: string;
    };

    const ownerId = (req.user!.role === 'admin' && createdBy) ? createdBy : req.user!.id;

    const lead = await LeadModel.create({
      name,
      email,
      status,
      source,
      createdBy: ownerId,
    });

    res.status(201).json({ success: true, message: 'Lead created successfully', data: lead });
  } catch (error) {
    next(error);
  }
}

export async function getLeads(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { status, source, search, sort, page: pageStr } = req.query;

    const filter: FilterQuery<ILeadDocument> = buildOwnerFilter(req);

    if (status) {
      filter.status = status as string;
    }

    if (source) {
      filter.source = source as string;
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const limit = 10;
    const page = parseInt((pageStr as string) || '1', 10) || 1;
    const skip = (page - 1) * limit;
    const sortOrder = sort === 'oldest' ? 1 : -1;

    const [leads, total] = await Promise.all([
      LeadModel.find(filter)
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name email'),
      LeadModel.countDocuments(filter),
    ]);

    const pagination: PaginationMeta = {
      total,
      page,
      limit: 10,
      totalPages: Math.ceil(total / limit),
    };

    res.status(200).json({ success: true, message: 'Leads fetched successfully', data: { leads, pagination } });
  } catch (error) {
    next(error);
  }
}

export async function getLeadById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const lead = await LeadModel.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      return next(new AppError('Lead not found', 404));
    }

    if (req.user!.role !== 'admin' && lead.createdBy.toString() !== req.user!.id) {
      return next(new AppError('Access denied', 403));
    }

    res.status(200).json({ success: true, message: 'Lead fetched successfully', data: lead });
  } catch (error) {
    next(error);
  }
}

export async function updateLead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const existing = await LeadModel.findById(req.params.id);

    if (!existing) {
      return next(new AppError('Lead not found', 404));
    }

    if (req.user!.role !== 'admin' && existing.createdBy.toString() !== req.user!.id) {
      return next(new AppError('Access denied', 403));
    }

    const lead = await LeadModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Lead updated successfully', data: lead });
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const existing = await LeadModel.findById(req.params.id);

    if (!existing) {
      return next(new AppError('Lead not found', 404));
    }

    if (req.user!.role !== 'admin' && existing.createdBy.toString() !== req.user!.id) {
      return next(new AppError('Access denied', 403));
    }

    await LeadModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
}

export async function exportLeadsCSV(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { status, source, search, sort } = req.query;

    const filter: FilterQuery<ILeadDocument> = buildOwnerFilter(req);

    if (status) {
      filter.status = status as string;
    }

    if (source) {
      filter.source = source as string;
    }

    if (search && typeof search === 'string') {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;

    const leads = await LeadModel.find(filter).sort({ createdAt: sortOrder }).lean();

    const csvData = leads.map((lead) => ({
      name: lead.name,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      createdAt: lead.createdAt,
    }));

    const csvContent = generateCSV(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads-export.csv"');
    res.send(csvContent);
  } catch (error) {
    next(error);
  }
}

export async function getDashboardStats(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const isAdmin = req.user!.role === 'admin';
    const ownerFilter: FilterQuery<ILeadDocument> = isAdmin
      ? {}
      : { createdBy: new mongoose.Types.ObjectId(req.user!.id) };

    const [totalLeads, newThisMonth, statusAggregation, sourceAggregation] = await Promise.all([
      LeadModel.countDocuments(ownerFilter),
      LeadModel.countDocuments({ ...ownerFilter, createdAt: { $gte: startOfMonth } }),
      LeadModel.aggregate([
        { $match: ownerFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      LeadModel.aggregate([
        { $match: ownerFilter },
        { $group: { _id: '$source', count: { $sum: 1 } } },
      ]),
    ]);

    const statusCounts = statusAggregation.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sourceCounts = sourceAggregation.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    res.status(200).json({
      success: true,
      message: 'Dashboard stats fetched successfully',
      data: {
        totalLeads,
        newThisMonth,
        qualifiedLeads: statusCounts['Qualified'] || 0,
        contactedLeads: statusCounts['Contacted'] || 0,
        statusCounts,
        sourceCounts,
      }
    });
  } catch (error) {
    next(error);
  }
}
