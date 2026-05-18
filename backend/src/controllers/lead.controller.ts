import type { Response, NextFunction } from 'express';
import { LeadModel } from '../models/lead.model';
import { AppError } from '../middleware/error.middleware';
import { sendSuccess } from '../utils/response.utils';
import { generateCSV } from '../utils/csv.utils';
import type { AuthenticatedRequest, LeadQueryParams, PaginationMeta } from '../types/index';

export async function createLead(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, status, source } = req.body as {
      name: string;
      email: string;
      status?: string;
      source: string;
    };

    const lead = await LeadModel.create({
      name,
      email,
      status,
      source,
      createdBy: req.user!.id,
    });

    sendSuccess(res, 201, 'Lead created successfully', lead);
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
    const queryParams = req.query as unknown as LeadQueryParams;

    const filter: Record<string, unknown> = {};

    if (queryParams.status) {
      filter.status = queryParams.status;
    }

    if (queryParams.source) {
      filter.source = queryParams.source;
    }

    if (queryParams.search) {
      filter.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { email: { $regex: queryParams.search, $options: 'i' } },
      ];
    }

    const limit = 10;
    const page = parseInt(queryParams.page || '1', 10) || 1;
    const skip = (page - 1) * limit;
    const sortOrder = queryParams.sort === 'oldest' ? 1 : -1;

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

    sendSuccess(res, 200, 'Leads fetched successfully', { leads, pagination });
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

    sendSuccess(res, 200, 'Lead fetched successfully', lead);
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
    const lead = await LeadModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return next(new AppError('Lead not found', 404));
    }

    sendSuccess(res, 200, 'Lead updated successfully', lead);
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
    const lead = await LeadModel.findByIdAndDelete(req.params.id);

    if (!lead) {
      return next(new AppError('Lead not found', 404));
    }

    sendSuccess(res, 200, 'Lead deleted successfully');
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
    const queryParams = req.query as unknown as LeadQueryParams;

    const filter: Record<string, unknown> = {};

    if (queryParams.status) {
      filter.status = queryParams.status;
    }

    if (queryParams.source) {
      filter.source = queryParams.source;
    }

    if (queryParams.search) {
      filter.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { email: { $regex: queryParams.search, $options: 'i' } },
      ];
    }

    const sortOrder = queryParams.sort === 'oldest' ? 1 : -1;

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
  _req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalLeads, newThisMonth, statusAggregation, sourceAggregation] = await Promise.all([
      LeadModel.countDocuments(),
      LeadModel.countDocuments({ createdAt: { $gte: startOfMonth } }),
      LeadModel.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      LeadModel.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
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

    sendSuccess(res, 200, 'Dashboard stats fetched successfully', {
      totalLeads,
      newThisMonth,
      qualifiedLeads: statusCounts['Qualified'] || 0,
      contactedLeads: statusCounts['Contacted'] || 0,
      statusCounts,
      sourceCounts,
    });
  } catch (error) {
    next(error);
  }
}
