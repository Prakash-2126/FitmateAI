import { Conversation } from '../models/Conversation.js';
import { Profile } from '../models/Profile.js';
import { getAIResponse } from '../services/aiService.js';

// @desc    Send a message to AI assistant
// @route   POST /api/ai/chat
// @access  Private
export const chatWithAI = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a non-empty prompt or question.',
      });
    }

    if (message.length > 1500) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long. Please keep questions under 1500 characters.',
      });
    }

    // Load or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id,
      });
    }

    if (!conversation) {
      conversation = new Conversation({
        user: req.user._id,
        title: message.trim().slice(0, 40) + '...',
        messages: [],
      });
    }

    // Fetch user profile context for tailored responses
    const profile = await Profile.findOne({ user: req.user._id });
    const userContext = {
      fitnessExperience: profile?.fitnessExperience,
      activityLevel: profile?.activityLevel,
    };

    // Call modular AI service
    const aiResult = await getAIResponse(
      message.trim(),
      conversation.messages,
      userContext
    );

    // Save user message and reply into conversation history
    conversation.messages.push({
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    });

    conversation.messages.push({
      role: 'assistant',
      content: aiResult.message,
      timestamp: new Date(),
    });

    await conversation.save();

    return res.status(200).json({
      success: true,
      isConfigured: aiResult.isConfigured,
      reply: aiResult.message,
      conversationId: conversation._id,
      messages: conversation.messages,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's AI conversations
// @route   GET /api/ai/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .select('title updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific conversation with messages
// @route   GET /api/ai/conversations/:id
// @access  Private
export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete or clear conversation
// @route   DELETE /api/ai/conversations/:id
// @access  Private
export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or access denied.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
