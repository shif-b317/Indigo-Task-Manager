const Task = require('../models/Task');

// Socket.io Helper to emit updates to user's room
const emitTaskUpdate = (req, eventName, data) => {
  const io = req.app.get('socketio');
  if (io && req.user) {
    // Emit only to the specific user's room
    io.to(req.user._id.toString()).emit(eventName, data);
  }
};

// @desc    Get user tasks with filtering, sorting and search
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy, order } = req.query;
    
    // Base query for specific user
    let query = { userId: req.user._id };

    // Filter by status
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by priority
    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    // Search filter (matches title or description case insensitively)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting parameters
    let sortObj = { createdAt: -1 }; // Default: Newest first
    if (sortBy) {
      const sortOrder = order === 'asc' ? 1 : -1;
      sortObj = { [sortBy]: sortOrder };
    }

    const tasks = await Task.find(query).sort(sortObj);
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single task details
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, subtasks, notes } = req.body;

    if (!title || !dueDate) {
      return res.status(400).json({ success: false, message: 'Please provide task title and due date' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description: description || '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      subtasks: subtasks || [],
      notes: notes || '',
    });

    // Real-time synchronization broadcast
    emitTaskUpdate(req, 'task_created', task);

    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Real-time synchronization broadcast
    emitTaskUpdate(req, 'task_updated', task);

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found or unauthorized' });
    }

    await Task.findByIdAndDelete(req.params.id);

    // Real-time synchronization broadcast
    emitTaskUpdate(req, 'task_deleted', { id: req.params.id });

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tasks statistics for dashboard analytics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Run aggregations or query counts
    const totalTasks = await Task.countDocuments({ userId });
    const completedTasks = await Task.countDocuments({ userId, status: 'Completed' });
    const pendingTasks = await Task.countDocuments({ userId, status: 'Pending' });
    const inProgressTasks = await Task.countDocuments({ userId, status: 'In Progress' });

    const highPriority = await Task.countDocuments({ userId, priority: 'High' });
    const mediumPriority = await Task.countDocuments({ userId, priority: 'Medium' });
    const lowPriority = await Task.countDocuments({ userId, priority: 'Low' });

    // Calculate completion rate percentage
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Fetch tasks due today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    
    const tasksDueToday = await Task.countDocuments({
      userId,
      dueDate: { $gte: startOfToday, $lte: endOfToday },
    });

    // Recent activity (5 most recently updated tasks)
    const recentActivity = await Task.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('title status priority updatedAt');

    res.status(200).json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        priority: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority,
        },
        completionRate,
        tasksDueToday,
        recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
