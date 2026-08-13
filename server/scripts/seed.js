import "dotenv/config";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Attendance from "../models/Attendance.js";
import Certificate from "../models/Certificate.js";
import Club from "../models/Club.js";
import Event from "../models/Event.js";
import Notification from "../models/Notification.js";
import Registration from "../models/Registration.js";
import User from "../models/User.js";

const certificateBaseUrl = "https://campus-connect-three-opal.vercel.app";
const at = (value) => new Date(value);

// These accounts already exist in the configured Atlas database. They are only
// looked up by email and are never created, updated, or deleted by this script.
const existingStudents = [
  { key: "aarav", fullName: "Aarav Sharma", email: "aarav@example.com" },
  { key: "akshay", fullName: "Akshay Anand", email: "nkanal38@gmail.com" },
];

const seedUsers = [
  ["admin", "Campus Connect Admin", "admin@campusconnect.com", "Admin@12345", "admin", "+919900000001"],
  ["rahul", "Rahul Mehta", "rahul.coordinator@campusconnect.com", "Coordinator@12345", "coordinator", "+919900000002"],
  ["priya", "Priya Sharma", "priya.coordinator@campusconnect.com", "Coordinator@12345", "coordinator", "+919900000003"],
  ["rohan", "Rohan Verma", "rohan.student@campusconnect.com", "Student@12345", "student", "+919900000004"],
  ["sneha", "Sneha Kapoor", "sneha.student@campusconnect.com", "Student@12345", "student", "+919900000005"],
  ["vikram", "Vikram Singh", "vikram.student@campusconnect.com", "Student@12345", "student", "+919900000006"],
].map(([key, fullName, email, password, role, phone]) => ({ key, fullName, email, password, role, phone }));

const clubSpecs = [
  {
    key: "coding", name: "Coding Club", category: "Technical", coordinatorKey: "rahul", membersCount: 126,
    description: "A technical community for programming, software development, competitive coding, and developer-focused activities.",
    socialLinks: { website: "https://campus-connect-three-opal.vercel.app/clubs/coding-club", linkedin: "https://www.linkedin.com/company/campus-connect-coding-club", github: "https://github.com/campus-connect/coding-club" },
  },
  {
    key: "robotics", name: "Robotics Club", category: "Technical", coordinatorKey: "priya", membersCount: 84,
    description: "A hands-on robotics community focused on automation, embedded systems, electronics, and robotics competitions.",
    socialLinks: { website: "https://campus-connect-three-opal.vercel.app/clubs/robotics-club", instagram: "https://www.instagram.com/campusconnectrobotics", github: "https://github.com/campus-connect/robotics-club" },
  },
  {
    key: "entrepreneurship", name: "Entrepreneurship Cell", category: "Other", coordinatorKey: "rahul", membersCount: 92,
    description: "A student community for entrepreneurship, startups, innovation, pitching, and business development.",
    socialLinks: { website: "https://campus-connect-three-opal.vercel.app/clubs/entrepreneurship-cell", linkedin: "https://www.linkedin.com/company/campus-connect-ecell" },
  },
  {
    key: "literary", name: "Literary Society", category: "Literary", coordinatorKey: "priya", membersCount: 63,
    description: "A creative community for writing, debates, public speaking, poetry, and literature.",
    socialLinks: { website: "https://campus-connect-three-opal.vercel.app/clubs/literary-society", instagram: "https://www.instagram.com/campusconnectliterary" },
  },
  {
    key: "sports", name: "Sports Club", category: "Sports", coordinatorKey: "rahul", membersCount: 148,
    description: "A campus sports community organizing tournaments, fitness activities, and inter-college competitions.",
    socialLinks: { website: "https://campus-connect-three-opal.vercel.app/clubs/sports-club", instagram: "https://www.instagram.com/campusconnectsports" },
  },
];

const eventSpecs = [
  {
    key: "hackathon", title: "Campus Hackathon 2026", slug: "campus-hackathon-2026", category: "Hackathon", mode: "offline", clubKey: "coding", coordinatorKey: "rahul", venue: "Main Seminar Hall",
    eventDate: at("2026-09-19T12:00:00+05:30"), startTime: "09:00", endTime: "18:00", registrationDeadline: at("2026-09-15T18:00:00+05:30"), maxParticipants: 100, entryFee: 0, isCertificateProvided: true, status: "published", tags: ["hackathon", "coding", "technology", "innovation"],
    description: "A full-day campus hackathon where student teams build practical technology solutions for college life and present them to a judging panel.",
  },
  {
    key: "aiWorkshop", title: "AI and Machine Learning Workshop", slug: "ai-machine-learning-workshop", category: "Workshop", mode: "hybrid", clubKey: "coding", coordinatorKey: "rahul", venue: "Computer Lab 1", meetingLink: "https://meet.google.com/campus-connect-ai",
    eventDate: at("2026-09-05T12:00:00+05:30"), startTime: "10:00", endTime: "15:30", registrationDeadline: at("2026-09-02T18:00:00+05:30"), maxParticipants: 80, entryFee: 0, isCertificateProvided: true, status: "published", tags: ["ai", "machine-learning", "workshop"],
    description: "A practical introduction to machine learning concepts, model evaluation, and responsible AI with guided coding exercises for beginners.",
  },
  {
    key: "roboticsChallenge", title: "Robotics Challenge", slug: "robotics-challenge", category: "Competition", mode: "offline", clubKey: "robotics", coordinatorKey: "priya", venue: "Innovation Lab",
    eventDate: at("2026-10-03T12:00:00+05:30"), startTime: "09:30", endTime: "17:00", registrationDeadline: at("2026-09-28T18:00:00+05:30"), maxParticipants: 60, entryFee: 100, isCertificateProvided: true, status: "published", tags: ["robotics", "competition", "electronics"],
    description: "Teams will design, program, and test autonomous robots against a sequence of hands-on engineering challenges.",
  },
  {
    key: "startupPitch", title: "Startup Pitch Competition", slug: "startup-pitch-competition", category: "Competition", mode: "offline", clubKey: "entrepreneurship", coordinatorKey: "rahul", venue: "Auditorium",
    eventDate: at("2026-10-10T12:00:00+05:30"), startTime: "11:00", endTime: "16:30", registrationDeadline: at("2026-10-05T18:00:00+05:30"), maxParticipants: 50, entryFee: 0, isCertificateProvided: true, status: "published", tags: ["startup", "entrepreneurship", "pitching"],
    description: "Student founders present early-stage ventures, receive feedback from mentors, and compete for incubation support.",
  },
  {
    key: "literaryEvening", title: "Literary Evening", slug: "literary-evening", category: "Cultural", mode: "offline", clubKey: "literary", coordinatorKey: "priya", venue: "Open Air Theatre",
    eventDate: at("2026-10-24T12:00:00+05:30"), startTime: "17:30", endTime: "20:30", registrationDeadline: at("2026-10-20T18:00:00+05:30"), maxParticipants: 120, entryFee: 0, isCertificateProvided: false, status: "published", tags: ["literature", "poetry", "debate"],
    description: "An evening of poetry, storytelling, debate, and spoken-word performances from the campus literary community.",
  },
  {
    key: "cricketTournament", title: "Inter College Cricket Tournament", slug: "inter-college-cricket-tournament", category: "Sports", mode: "offline", clubKey: "sports", coordinatorKey: "rahul", venue: "College Sports Ground",
    eventDate: at("2026-11-14T12:00:00+05:30"), startTime: "08:00", endTime: "18:00", registrationDeadline: at("2026-11-07T18:00:00+05:30"), maxParticipants: 200, entryFee: 50, isCertificateProvided: true, status: "published", tags: ["cricket", "sports", "tournament"],
    description: "An inter-college cricket tournament featuring league fixtures, knockout matches, and campus team selections.",
  },
  {
    key: "competitiveProgramming", title: "Introduction to Competitive Programming", slug: "introduction-to-competitive-programming", category: "Seminar", mode: "online", clubKey: "coding", coordinatorKey: "rahul", meetingLink: "https://meet.google.com/campus-connect-cp",
    eventDate: at("2026-07-25T12:00:00+05:30"), startTime: "10:00", endTime: "13:00", registrationDeadline: at("2026-07-22T18:00:00+05:30"), maxParticipants: 100, entryFee: 0, isCertificateProvided: true, status: "completed", tags: ["programming", "competitive-programming", "algorithms"],
    description: "A completed online seminar covering problem-solving patterns, algorithmic thinking, and a roadmap for competitive programming practice.",
  },
];

const registrationSpecs = [
  ["aaravHackathon", "aarav", "hackathon", "2026-08-10T10:15:00+05:30", "registered", "free", "CC-HACK-AARAV-2026", false, "pending", false, "Registered as part of a two-member team."],
  ["aaravAiWorkshop", "aarav", "aiWorkshop", "2026-08-11T12:30:00+05:30", "registered", "free", "CC-AI-AARAV-2026", false, "pending", false, "Will attend the in-person lab session."],
  ["rohanHackathon", "rohan", "hackathon", "2026-08-12T09:45:00+05:30", "registered", "free", "CC-HACK-ROHAN-2026", false, "pending", false, "Interested in the web-development track."],
  ["rohanRobotics", "rohan", "roboticsChallenge", "2026-08-12T14:20:00+05:30", "registered", "paid", "CC-ROBOT-ROHAN-2026", false, "pending", false, "Entry fee received; registered for the autonomous-robot track."],
  ["snehaAiWorkshop", "sneha", "aiWorkshop", "2026-08-12T16:00:00+05:30", "registered", "free", "CC-AI-SNEHA-2026", false, "pending", false, "Requested the hybrid participation option."],
  ["snehaStartupPitch", "sneha", "startupPitch", "2026-08-13T11:10:00+05:30", "registered", "free", "CC-PITCH-SNEHA-2026", false, "pending", false, "Pitching a campus sustainability idea."],
  ["vikramLiteraryEvening", "vikram", "literaryEvening", "2026-08-13T12:20:00+05:30", "registered", "free", "CC-LIT-VIKRAM-2026", false, "pending", false, "Registered for the open-mic poetry segment."],
  ["vikramCompetitiveProgramming", "vikram", "competitiveProgramming", "2026-07-15T10:30:00+05:30", "attended", "free", "CC-CP-VIKRAM-2026", true, "present", true, "Completed the introductory problem-solving exercise.", "2026-07-25T10:06:00+05:30"],
  ["akshayCompetitiveProgramming", "akshay", "competitiveProgramming", "2026-07-18T15:40:00+05:30", "attended", "free", "CC-CP-AKSHAY-2026", false, "absent", false, "Registration retained for attendance reporting; did not check in."],
].map(([key, studentKey, eventKey, registrationDate, registrationStatus, paymentStatus, qrCode, checkedIn, attendanceStatus, certificateIssued, notes, checkedInAt]) => ({ key, studentKey, eventKey, registrationDate: at(registrationDate), registrationStatus, paymentStatus, qrCode, checkedIn, attendanceStatus, certificateIssued, notes, ...(checkedInAt ? { checkedInAt: at(checkedInAt) } : {}) }));

const attendanceSpecs = [
  ["vikramCompetitiveProgramming", "vikram", "competitiveProgramming", "rahul", "present", "2026-07-25T10:06:00+05:30", "2026-07-25T12:55:00+05:30", "qr", "Checked in using the event QR code and attended the full seminar."],
  ["akshayCompetitiveProgramming", "akshay", "competitiveProgramming", "rahul", "absent", "2026-07-25T13:05:00+05:30", undefined, "manual", "Marked absent after the session attendance reconciliation."],
].map(([registrationKey, studentKey, eventKey, markedByKey, attendanceStatus, checkInTime, checkOutTime, verificationMethod, remarks]) => ({ registrationKey, studentKey, eventKey, markedByKey, attendanceStatus, checkInTime: at(checkInTime), ...(checkOutTime ? { checkOutTime: at(checkOutTime) } : {}), verificationMethod, remarks }));

const certificateSpecs = [{
  registrationKey: "vikramCompetitiveProgramming", studentKey: "vikram", eventKey: "competitiveProgramming", issuedByKey: "admin", certificateId: "CC-2026-0001", verificationCode: "CCVERIFY-2026-0001", issueDate: at("2026-07-27T12:00:00+05:30"),
  remarks: "Certificate of participation for completing the competitive programming seminar.",
}];

const saltRounds = () => {
  const value = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
  return Number.isInteger(value) && value >= 10 && value <= 14 ? value : 12;
};

const getClientUrl = () => {
  const value = process.env.CLIENT_URL?.trim().replace(/\/+$/, "");
  if (!value || new URL(value).protocol !== "https:") {
    throw new Error("CLIENT_URL must be configured with an HTTPS frontend URL before seeding notifications.");
  }
  return value;
};

const insertOnly = async (Model, filter, values) => {
  const existed = Boolean(await Model.exists(filter));
  // Validate the complete insert payload as a document before using the atomic
  // $setOnInsert operation. Query validators cannot evaluate cross-field
  // validators (for example Registration.checkedInAt -> checkedIn) reliably.
  await new Model(values).validate();
  const result = await Model.findOneAndUpdate(filter, { $setOnInsert: values }, {
    upsert: true, returnDocument: "after", setDefaultsOnInsert: true, includeResultMetadata: true,
  });
  return {
    document: result?.value ?? result,
    created: result?.lastErrorObject ? !result.lastErrorObject.updatedExisting : !existed,
  };
};

const sameId = (left, right) => left?.toString() === right?.toString();

const validateSeedData = async ({ users, clubs, events, registrations, attendance, certificates, notifications }) => {
  const coordinatorIds = [...new Set(Object.values(clubs).map((club) => club.coordinator.toString()))];
  if ((await User.countDocuments({ _id: { $in: coordinatorIds } })) !== coordinatorIds.length) {
    throw new Error("Seed validation failed: a club coordinator does not exist.");
  }

  for (const event of Object.values(events)) {
    const [club, coordinator] = await Promise.all([Club.exists({ _id: event.club }), User.exists({ _id: event.coordinator })]);
    if (!club || !coordinator) throw new Error(`Seed validation failed: invalid event relationship for ${event.slug}.`);
    const active = await Registration.countDocuments({ event: event._id, registrationStatus: { $ne: "cancelled" } });
    if (event.registeredCount !== active) throw new Error(`Seed validation failed: registeredCount mismatch for ${event.slug}.`);
  }

  for (const registration of Object.values(registrations)) {
    const [student, event] = await Promise.all([User.exists({ _id: registration.student }), Event.exists({ _id: registration.event })]);
    if (!student || !event) throw new Error(`Seed validation failed: invalid registration relationship for ${registration._id}.`);
  }

  for (const record of Object.values(attendance)) {
    const registration = await Registration.findById(record.registration).select("student event").lean();
    if (!registration || !sameId(registration.student, record.student) || !sameId(registration.event, record.event) || !(await User.exists({ _id: record.markedBy }))) {
      throw new Error(`Seed validation failed: invalid attendance relationship for ${record._id}.`);
    }
  }

  for (const certificate of Object.values(certificates)) {
    const registration = await Registration.findById(certificate.registration).select("student event").lean();
    if (!registration || !sameId(registration.student, certificate.student) || !sameId(registration.event, certificate.event) || !(await User.exists({ _id: certificate.issuedBy })) || certificate.status !== "issued" || !certificate.certificate?.url || new URL(certificate.certificate.url).protocol !== "https:") {
      throw new Error(`Seed validation failed: invalid certificate ${certificate._id}.`);
    }
  }

  for (const notification of Object.values(notifications)) {
    if (!(await User.exists({ _id: notification.recipient }))) throw new Error(`Seed validation failed: invalid notification recipient for ${notification._id}.`);
  }

  if (!Object.values(users).every(Boolean)) throw new Error("Seed validation failed: a required user is missing.");
};

const printSummary = (summary) => {
  console.info("\nUsers:");
  console.info(`  Existing users reused: ${summary.users.existingReused}`);
  console.info(`  Seed users reused: ${summary.users.reused}`);
  console.info(`  Users created: ${summary.users.created}`);
  for (const name of ["clubs", "events", "registrations", "attendance", "certificates", "notifications"]) {
    console.info(`\n${name[0].toUpperCase()}${name.slice(1)}:`);
    console.info(`  Created: ${summary[name].created}`);
    console.info(`  Reused: ${summary[name].reused}`);
  }
};

const seed = async () => {
  const clientUrl = getClientUrl();
  const summary = Object.fromEntries(["clubs", "events", "registrations", "attendance", "certificates", "notifications"].map((name) => [name, { created: 0, reused: 0 }]));
  summary.users = { created: 0, reused: 0, existingReused: 0 };
  const users = {};

  for (const spec of existingStudents) {
    const user = await User.findOne({ email: spec.email }).select("_id fullName email role isActive");
    if (!user) throw new Error(`Required existing user was not found by email: ${spec.email}`);
    users[spec.key] = user;
    summary.users.existingReused += 1;
  }

  for (const spec of seedUsers) {
    const existing = await User.findOne({ email: spec.email }).select("_id fullName email role isActive");
    if (existing) {
      users[spec.key] = existing;
      summary.users.reused += 1;
      continue;
    }
    const password = await bcrypt.hash(spec.password, saltRounds());
    const result = await insertOnly(User, { email: spec.email }, { fullName: spec.fullName, email: spec.email, password, role: spec.role, phone: spec.phone, isVerified: true, isActive: true });
    users[spec.key] = result.document;
    if (result.created) {
      const createdUser = await User.findById(result.document._id).select("+password").lean();
      if (!createdUser?.password || !(await bcrypt.compare(spec.password, createdUser.password))) throw new Error(`Password hashing validation failed for ${spec.email}.`);
      summary.users.created += 1;
    } else {
      summary.users.reused += 1;
    }
  }

  const clubs = {};
  for (const spec of clubSpecs) {
    const { key, coordinatorKey, ...data } = spec;
    const result = await insertOnly(Club, { name: data.name }, { ...data, coordinator: users[coordinatorKey]._id, status: "active", isVerified: true });
    clubs[key] = result.document;
    summary.clubs[result.created ? "created" : "reused"] += 1;
  }

  const events = {};
  for (const spec of eventSpecs) {
    const { key, clubKey, coordinatorKey, ...data } = spec;
    const result = await insertOnly(Event, { slug: data.slug }, { ...data, club: clubs[clubKey]._id, coordinator: users[coordinatorKey]._id, registeredCount: 0 });
    events[key] = result.document;
    summary.events[result.created ? "created" : "reused"] += 1;
  }

  const registrations = {};
  for (const spec of registrationSpecs) {
    const { key, studentKey, eventKey, qrCode, ...data } = spec;
    const result = await insertOnly(Registration, { student: users[studentKey]._id, event: events[eventKey]._id }, { ...data, student: users[studentKey]._id, event: events[eventKey]._id, qrCode: { code: qrCode } });
    registrations[key] = result.document;
    summary.registrations[result.created ? "created" : "reused"] += 1;
  }

  for (const [key, event] of Object.entries(events)) {
    const active = await Registration.countDocuments({ event: event._id, registrationStatus: { $ne: "cancelled" } });
    if (active > event.maxParticipants) throw new Error(`Cannot synchronize ${event.slug}: active registrations exceed maxParticipants.`);
    if (active !== event.registeredCount) events[key] = await Event.findByIdAndUpdate(event._id, { $set: { registeredCount: active } }, { returnDocument: "after", runValidators: true });
  }

  const attendance = {};
  for (const spec of attendanceSpecs) {
    const { registrationKey, studentKey, eventKey, markedByKey, ...data } = spec;
    const result = await insertOnly(Attendance, { registration: registrations[registrationKey]._id }, { ...data, registration: registrations[registrationKey]._id, student: users[studentKey]._id, event: events[eventKey]._id, markedBy: users[markedByKey]._id });
    attendance[registrationKey] = result.document;
    summary.attendance[result.created ? "created" : "reused"] += 1;
  }

  const certificates = {};
  for (const spec of certificateSpecs) {
    const { registrationKey, studentKey, eventKey, issuedByKey, certificateId, verificationCode, ...data } = spec;
    const result = await insertOnly(Certificate, { registration: registrations[registrationKey]._id }, {
      ...data, registration: registrations[registrationKey]._id, student: users[studentKey]._id, event: events[eventKey]._id, issuedBy: users[issuedByKey]._id, certificateId, verificationCode, status: "issued",
      certificate: { public_id: `campus-connect/${certificateId}`, url: `${certificateBaseUrl}/certificates/${certificateId}` },
    });
    certificates[registrationKey] = result.document;
    summary.certificates[result.created ? "created" : "reused"] += 1;
    if (!registrations[registrationKey].certificateIssued) {
      await Registration.updateOne({ _id: registrations[registrationKey]._id }, { $set: { certificateIssued: true } }, { runValidators: true });
      registrations[registrationKey] = await Registration.findById(registrations[registrationKey]._id);
    }
  }

  const notifications = {};
  const notificationSpecs = [
    ["aarav", "Registration confirmed: Campus Hackathon 2026", "Your place in Campus Hackathon 2026 is confirmed. Your QR ticket is ready in My Registrations.", "registration", "normal", false, undefined, `events/${events.hackathon.slug}`, "aarav-hackathon-registration-confirmed", { eventId: events.hackathon._id, registrationId: registrations.aaravHackathon._id }],
    ["rohan", "Payment received: Robotics Challenge", "Your Robotics Challenge entry fee has been received. Bring your QR ticket to the Innovation Lab on event day.", "registration", "high", false, undefined, `events/${events.roboticsChallenge.slug}`, "rohan-robotics-payment-received", { eventId: events.roboticsChallenge._id, registrationId: registrations.rohanRobotics._id }],
    ["sneha", "New event published: Startup Pitch Competition", "The Entrepreneurship Cell has published the Startup Pitch Competition. Your registration is confirmed.", "event", "normal", false, undefined, `events/${events.startupPitch.slug}`, "sneha-startup-pitch-published", { eventId: events.startupPitch._id, registrationId: registrations.snehaStartupPitch._id }],
    ["vikram", "Attendance marked: Introduction to Competitive Programming", "Your attendance has been marked present for Introduction to Competitive Programming.", "attendance", "normal", true, "2026-07-25T15:00:00+05:30", "student/registrations", "vikram-competitive-programming-attendance", { eventId: events.competitiveProgramming._id, registrationId: registrations.vikramCompetitiveProgramming._id }],
    ["vikram", "Certificate issued: Introduction to Competitive Programming", "Your certificate of participation is ready to view and share.", "certificate", "high", false, undefined, `certificates/${certificates.vikramCompetitiveProgramming.certificateId}`, "vikram-competitive-programming-certificate-issued", { eventId: events.competitiveProgramming._id, registrationId: registrations.vikramCompetitiveProgramming._id, certificateId: certificates.vikramCompetitiveProgramming._id }],
    ["akshay", "Attendance updated: Introduction to Competitive Programming", "Your attendance record for Introduction to Competitive Programming is marked absent. Contact the Coding Club for questions.", "attendance", "normal", true, "2026-07-26T10:00:00+05:30", "student/registrations", "akshay-competitive-programming-attendance", { eventId: events.competitiveProgramming._id, registrationId: registrations.akshayCompetitiveProgramming._id }],
    ["rahul", "Campus Hackathon 2026 is live", "Campus Hackathon 2026 has been published and is ready to accept student registrations.", "event", "normal", false, undefined, `coordinator/events/${events.hackathon._id}`, "rahul-hackathon-published", { eventId: events.hackathon._id }],
    ["priya", "Robotics Challenge registrations are open", "The Robotics Challenge has been published with a participant capacity of 60 students.", "event", "normal", false, undefined, `coordinator/events/${events.roboticsChallenge._id}`, "priya-robotics-challenge-published", { eventId: events.roboticsChallenge._id }],
    ["admin", "Campus Connect demo data is available", "Demo clubs, events, registrations, attendance records, certificates, and notifications are ready for review.", "system", "low", true, "2026-08-13T09:00:00+05:30", "admin/dashboard", "admin-demo-data-ready", {}],
    ["sneha", "Welcome to the Campus Connect event season", "Explore the new technical, cultural, entrepreneurship, and sports events now open on Campus Connect.", "announcement", "low", false, undefined, "events", "sneha-event-season-announcement", {}],
  ];

  for (const [recipientKey, title, message, type, priority, isRead, readAt, actionPath, seedKey, metadata] of notificationSpecs) {
    const result = await insertOnly(Notification, { recipient: users[recipientKey]._id, "metadata.seedKey": seedKey }, {
      recipient: users[recipientKey]._id, title, message, type, priority, isRead, ...(readAt ? { readAt: at(readAt) } : {}), actionUrl: `${clientUrl}/${actionPath.replace(/^\/+/, "")}`, metadata: { seedKey, ...metadata },
    });
    notifications[seedKey] = result.document;
    summary.notifications[result.created ? "created" : "reused"] += 1;
  }

  await validateSeedData({ users, clubs, events, registrations, attendance, certificates, notifications });
  return summary;
};

console.info("Campus Connect database seed started...");
try {
  await connectDB();
  printSummary(await seed());
  console.info("\nCampus Connect database seed completed successfully.");
} catch (error) {
  console.error("Campus Connect database seed failed:", error);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.info("MongoDB connection closed.");
  }
}
