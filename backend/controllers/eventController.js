const Event = require('../models/eventModel');
const User = require('../models/userModel');
const sendEmail = require('../utils/sendEmail');

const getEvents = async (req, res) => {
  const events = await Event.find({});
  res.json(events);
};

const getEventById = async (req, res) => {
  const event = await Event.findById(req.params.id).populate('registeredParticipants', 'name email');
  if (event) {
    res.json(event);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
};

const createEvent = async (req, res) => {
  const event = new Event(req.body);
  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
};

const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
};

const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
};

const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const user = req.user || await User.findById(req.body.userId);
  const { registrationDetails } = req.body;

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (!user) {
    res.status(404);
    throw new Error('User not found. Please log in again.');
  }

  // Check if already registered (using String comparison for safety)
  const isAlreadyRegistered = event.registeredParticipants.some(
    (id) => id.toString() === user._id.toString()
  );

  if (isAlreadyRegistered) {
    res.status(400);
    throw new Error('Already registered for this event');
  }
  
  // Update Event
  event.registeredParticipants.push(user._id);
  await event.save();

  // Update User (prevent duplicates)
  const userAlreadyHasEvent = user.registeredEvents.some(
    (id) => id.toString() === event._id.toString()
  );

  if (!userAlreadyHasEvent) {
    user.registeredEvents.push(event._id);
    await user.save();
  }

  // Determine recipient details (prefer details from form)
  const recipientEmail = registrationDetails?.email || user.email;
  const recipientName = registrationDetails?.name || user.name;

  // Send Email
  console.log(`Attempting to send registration email to: ${recipientEmail} (User: ${user.email}) for event: ${event.title}`);
  
  const emailHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
      <div style="background-color: #5CB85C; padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 32px; letter-spacing: 3px; font-weight: 900;">EVENTIFY</h1>
        <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-weight: 500;">Registration Confirmed!</p>
      </div>
      
      <div style="padding: 40px; color: #1e293b;">
        <h2 style="font-size: 24px; font-weight: 700; margin-bottom: 20px; color: #0f172a;">Hello ${recipientName},</h2>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">You have successfully registered for the following event. We're excited to have you join us!</p>
        
        <div style="background-color: #f8fafc; border-radius: 12px; padding: 25px; border-left: 5px solid #5CB85C; margin-bottom: 30px;">
          <h3 style="margin-top: 0; color: #5CB85C; font-size: 20px; margin-bottom: 15px;">${event.title}</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600; width: 80px;">Date:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${event.date}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Time:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${event.time}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Venue:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${event.venue}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-weight: 600;">Location:</td>
              <td style="padding: 8px 0; color: #0f172a; font-weight: 700;">${event.location}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Please bring a copy of this email (either printed or on your phone) to the event for check-in.</p>
        
        <div style="text-align: center; margin-top: 40px;">
          <a href="#" style="background-color: #0f172a; color: white; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; display: inline-block;">VIEW EVENT DETAILS</a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 40px 0;">
        
        <p style="font-size: 12px; color: #94a3b8; text-align: center; line-height: 1.5;">
          This is an automated confirmation email from Eventify System.<br>
          If you have any questions, please contact our support team.
        </p>
      </div>
      
      <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
        © 2026 Eventify. All rights reserved.
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: recipientEmail,
      subject: `Registration Confirmed: ${event.title} - Eventify`,
      message: `You have successfully registered for ${event.title}.`,
      html: emailHtml,
    });
    console.log(`Email sent successfully to ${recipientEmail}`);
  } catch (error) {
    console.error('Email send failed:', error.message);
  }

  res.status(200).json({ message: 'Successfully registered' });
};

const cancelRegistration = async (req, res) => {
  const event = await Event.findById(req.params.id);
  const { userId } = req.body;

  if (!event) {
    res.status(404);
    throw new Error('Event not found');
  }

  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  const isRegistered = event.registeredParticipants.some(
    (participantId) => participantId.toString() === userId
  );

  if (!isRegistered) {
    res.status(400);
    throw new Error('You are not registered for this event');
  }

  event.registeredParticipants = event.registeredParticipants.filter(
    (participantId) => participantId.toString() !== userId
  );

  await event.save();
  res.status(200).json({ message: 'Registration cancelled successfully' });
};

const getRecommendedEvents = async (req, res) => {
  try {
    const { userId } = req.query;
    
    // 1. Find user's interests (categories of events they are registered for)
    const userEvents = await Event.find({ registeredParticipants: userId });
    const interests = [...new Set(userEvents.map(e => e.category))];

    // 2. Base query: events user is NOT registered for
    const baseQuery = { registeredParticipants: { $ne: userId } };

    let recommended = [];

    // 3. If user has interests, find events in those categories
    if (interests.length > 0) {
      recommended = await Event.find({
        ...baseQuery,
        category: { $in: interests }
      }).limit(6);
    }

    // 4. Fill to 6 items with newest/general events if needed
    if (recommended.length < 6) {
      const moreEvents = await Event.find({
        ...baseQuery,
        _id: { $nin: recommended.map(e => e._id) }
      })
      .sort({ createdAt: -1 })
      .limit(6 - recommended.length);
      
      recommended = [...recommended, ...moreEvents];
    }

    res.json(recommended);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventsBySpeaker = async (req, res) => {
  try {
    const events = await Event.find({ speakers: req.params.speakerId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getRecommendedEvents,
  getEventsBySpeaker,
};
