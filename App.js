import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const COLORS = {
  ink: '#20264A',
  muted: '#68718F',
  line: '#E3E5F5',
  canvas: '#F4F5FC',
  white: '#FFFFFF',
  blue: '#5147E8',
  paleBlue: '#EFEDFF',
  green: '#078B75',
  paleGreen: '#E1F7F1',
  amber: '#C97712',
  paleAmber: '#FFF2D8',
  red: '#D84368',
  paleRed: '#FDE9EF',
  navy: '#25205F',
};

const MONTH = 'November 2026';
const WORKSPACE_STORAGE_KEY = 'hrms-organisation-workspace-v1';
const nextPayrollMonth = (month) => {
  const [monthName, year] = month.split(' ');
  const monthIndex = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].indexOf(monthName);
  const next = new Date(Number(year), monthIndex + 1, 1);
  return `${next.toLocaleString('en-US', { month: 'long' })} ${next.getFullYear()}`;
};
const SUPER_ADMIN = { email: 'owner@northstar.demo', password: 'Owner123!', name: 'Rahul' };
const initialSuperAdmins = [{ id: 'sa1', ...SUPER_ADMIN }];

const initialEmployees = [
  { id: 'e1', name: 'Jeevan', email: 'ava@northstar.demo', phone: '+1 555 0101', title: 'Product Designer', department: 'Product', adminId: 'a1', shift: '09:00 – 17:00', attendance: 'Present', punchIn: '08:54', punchOut: '17:08', breakIn: '12:30', breakOut: '13:00', leaves: [{ type: 'Annual', days: 1 }], base: 15000, overtime: 140, ef: 30, esi: 52, pf: 260, paid: false },
  { id: 'e2', name: 'Kumar', email: 'ethan@northstar.demo', phone: '+1 555 0102', title: 'Frontend Engineer', department: 'Engineering', adminId: 'a1', shift: '09:00 – 17:00', attendance: 'Present', punchIn: '09:02', punchOut: '—', breakIn: '12:05', breakOut: '12:35', leaves: [], base: 15000, overtime: 90, ef: 30, esi: 61, pf: 305, paid: true },
  { id: 'e3', name: 'Mahesh', email: 'mia@northstar.demo', phone: '+1 555 0103', title: 'People Specialist', department: 'People', adminId: 'a1', shift: '08:00 – 16:00', attendance: 'On leave', punchIn: '—', punchOut: '—', breakIn: '—', breakOut: '—', leaves: [{ type: 'Emergency', days: 1 }, { type: 'Casual', days: 1 }], base: 15000, overtime: 0, ef: 25, esi: 48, pf: 240, paid: false },
  { id: 'e4', name: 'Rafeeq', email: 'noah@northstar.demo', phone: '+1 555 0104', title: 'Finance Analyst', department: 'Finance', adminId: 'a1', shift: '10:00 – 18:00', attendance: 'Present', punchIn: '09:57', punchOut: '18:03', breakIn: '13:00', breakOut: '13:30', leaves: [{ type: 'Annual', days: 2 }], base: 15000, overtime: 220, ef: 30, esi: 55, pf: 275, paid: true },
  { id: 'e5', name: 'Harsha', email: 'liam@northstar.demo', phone: '+1 555 0105', title: 'QA Engineer', department: 'Engineering', adminId: 'a2', shift: '09:00 – 17:00', attendance: 'Present', punchIn: '08:48', punchOut: '17:02', breakIn: '12:15', breakOut: '12:45', leaves: [], base: 15000, overtime: 80, ef: 28, esi: 57, pf: 285, paid: false },
  { id: 'e6', name: 'Vaishnav', email: 'sofia@northstar.demo', phone: '+1 555 0106', title: 'Marketing Lead', department: 'Marketing', adminId: 'a2', shift: '09:00 – 17:00', attendance: 'Present', punchIn: '09:00', punchOut: '17:00', breakIn: '12:00', breakOut: '12:30', leaves: [{ type: 'Sick', days: 1 }], base: 15000, overtime: 0, ef: 30, esi: 59, pf: 295, paid: true },
  { id: 'e7', name: 'Manu', email: 'oliver@northstar.demo', phone: '+1 555 0107', title: 'Operations Associate', department: 'Operations', adminId: 'a2', shift: '08:00 – 16:00', attendance: 'Late', punchIn: '09:16', punchOut: '—', breakIn: '12:20', breakOut: '12:50', leaves: [{ type: 'Annual', days: 3 }], base: 15000, overtime: 160, ef: 25, esi: 45, pf: 225, paid: false },
  { id: 'e8', name: 'Praveen', email: 'isabella@northstar.demo', phone: '+1 555 0108', title: 'Data Analyst', department: 'Data', adminId: 'a2', shift: '10:00 – 18:00', attendance: 'Present', punchIn: '09:55', punchOut: '18:04', breakIn: '13:00', breakOut: '13:30', leaves: [], base: 15000, overtime: 110, ef: 28, esi: 56, pf: 280, paid: true },
];

const initialAdmins = [
  { id: 'a1', name: 'Kushal', email: 'nithya@northstar.com', password: 'nithya123!', phone: '+1 555 0201', title: 'People Operations Admin', salary: 20000, ef: 0, esi: 0, pf: 0, paid: true, leaves: [{ type: 'Annual', days: 1 }, { type: 'Emergency', days: 1 }, { type: 'Casual', days: 1 }], employeeIds: ['e1', 'e2', 'e3', 'e4'], accessModule: 'attendance', shift: '09:00 – 17:00', attendance: 'Present', punchIn: '08:58', punchOut: '17:06', breakIn: '12:30', breakOut: '13:00', lunchOut: '13:10', lunchIn: '13:40' },
  { id: 'a2', name: 'Shivu', email: 'kushal@northstar.com', password: 'kushal123!', phone: '+1 555 0202', title: 'Operations Admin', salary: 20000, ef: 0, esi: 0, pf: 0, paid: false, leaves: [{ type: 'Sick', days: 1 }], employeeIds: ['e5', 'e6', 'e7', 'e8'], accessModule: 'attendance', shift: '09:00 – 17:00', attendance: 'Late', punchIn: '09:12', punchOut: '17:02', breakIn: '12:30', breakOut: '13:00', lunchOut: '13:10', lunchIn: '13:40' },
];

const loadWorkspaceData = () => {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  const saved = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
  if (!saved) return null;
  const workspace = JSON.parse(saved);
  if (!workspace || !Array.isArray(workspace.admins) || !Array.isArray(workspace.employees) || !Array.isArray(workspace.audit) || (workspace.publicEvents !== undefined && !Array.isArray(workspace.publicEvents))) {
    throw new Error('Saved HRMS workspace data is invalid.');
  }
  return workspace;
};

const money = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(Number(value) || 0));
const extraLeaveDays = (leaves = []) => leaves.reduce((sum, leave) => sum + (
  leave.type !== 'Casual' ? Number(leave.extraDays ?? (leave.type === 'Unpaid' ? leave.days : 0)) || 0 : 0
), 0);
const calculateExtraLeaveDeduction = (base, days) => Math.max(0, (Number(base) || 0) / 30 * (Number(days) || 0));
const employeeExtraLeaveDays = (employee) => {
  const leaves = employee.leaves || [];
  const savedDays = extraLeaveDays(leaves);
  if (savedDays > 0 || leaves.some((leave) => leave.type === 'Unpaid')) return savedDays;
  const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory.filter(Boolean) : [];
  const adminRecords = history.filter((record) => !record.demo && typeof record.date === 'string');
  if (adminRecords.length) {
    const latestRecord = adminRecords.reduce((latest, record) => (
      String(record.updatedAt || record.date) > String(latest.updatedAt || latest.date) ? record : latest
    ));
    return Math.max(0, Number(latestRecord.extraLeaveDays) || 0);
  }
  return history.reduce((sum, record) => sum + Math.max(0, Number(record.extraLeaveDays) || 0), 0);
};
const extraLeaveDeduction = (person) => {
  const savedDays = extraLeaveDays(person.leaves || []);
  const days = employeeExtraLeaveDays(person);
  if (!days) return 0;
  if (!savedDays) return calculateExtraLeaveDeduction(person.base, days);
  const savedDeduction = Number(person.extraLeaveDeduction);
  return Math.max(0, savedDeduction > 0 ? savedDeduction : calculateExtraLeaveDeduction(person.base, days));
};
const loanBalance = (person) => Math.max(0, Number(person.loanBalance) || 0);
const loanTermMonths = (person) => Number.isSafeInteger(Number(person.loanTermMonths)) && Number(person.loanTermMonths) > 0
  ? Number(person.loanTermMonths)
  : 10;
const scheduledLoanDeduction = (person) => {
  const principal = Math.max(0, Number(person.loanPrincipal) || 0);
  const balance = loanBalance(person);
  const termMonths = loanTermMonths(person);
  const monthsRemaining = Math.max(0, termMonths - (Number(person.loanMonthsPaid) || 0));
  if (!principal || !balance || !monthsRemaining) return 0;
  return Math.min(balance, Math.ceil(balance / monthsRemaining));
};
const loanDeduction = (person, payrollMonth = MONTH) => person.loanLastPaidMonth === payrollMonth
  ? Math.max(0, Number(person.loanLastDeduction) || 0)
  : scheduledLoanDeduction(person);
const loanMonthsRemaining = (person) => {
  const balance = loanBalance(person);
  if (!balance) return 0;
  const termMonths = loanTermMonths(person);
  const monthsRemaining = Math.max(0, termMonths - (Number(person.loanMonthsPaid) || 0));
  const installment = monthsRemaining ? Math.ceil(balance / monthsRemaining) : 0;
  return installment ? Math.min(monthsRemaining, Math.ceil(balance / installment)) : 0;
};
const netSalary = (person, payrollMonth = MONTH) => {
  const overtime = Object.prototype.hasOwnProperty.call(person, 'punchIn') ? employeeOvertimeBonus(person) : Number(person.overtime || 0);
  return Math.max(0, Number(person.base || person.salary || 0) + overtime - Number(person.ef || 0) - Number(person.esi || 0) - Number(person.pf || 0) - extraLeaveDeduction(person) - loanDeduction(person, payrollMonth));
};
const adminExtraLeaveDays = (admin = {}) => (admin.leaves || [])
  .reduce((sum, leave) => sum + (leave.type === 'Casual' ? 0 : Number(leave.extraDays ?? leave.days ?? 0)), 0);
const adminExtraLeaveDeduction = (admin = {}) => {
  const base = Number(admin.salary) || 0;
  const days = adminExtraLeaveDays(admin);
  return days ? calculateExtraLeaveDeduction(base, days) : 0;
};
const adminNetSalary = (admin, payrollMonth = MONTH) => Math.max(0,
  (Number(admin.salary) || 0)
  + overtimeBonus(admin)
  - (Number(admin.ef) || 0)
  - (Number(admin.esi) || 0)
  - (Number(admin.pf) || 0)
  - adminExtraLeaveDeduction(admin)
  - loanDeduction(admin, payrollMonth)
);
const payrollDraftNetSalary = (draft, payrollMonth = MONTH) => {
  const extra = Number(draft.extraLeaves) || 0;
  const leaves = (draft.leaves || []).filter((leave) => leave.type !== 'Unpaid');
  if (extra > 0) leaves.push({ type: 'Unpaid', extraDays: extra });
  const currentBalance = loanBalance(draft);
  const newLoan = currentBalance ? 0 : Math.max(0, Number(draft.newLoanAmount) || 0);
  const person = currentBalance
    ? isPositiveInteger(draft.newLoanMonths)
      ? { ...draft, loanTermMonths: (Number(draft.loanMonthsPaid) || 0) + Number(draft.newLoanMonths) }
      : draft
    : !newLoan && draft.loanLastPaidMonth === payrollMonth
      ? draft
      : {
        ...draft,
        loanPrincipal: newLoan,
        loanBalance: newLoan,
        loanTermMonths: Number(draft.newLoanMonths) || loanTermMonths(draft),
        loanMonthsPaid: 0,
        loanLastPaidMonth: null,
        loanLastDeduction: 0,
      };
  return netSalary({ ...person, leaves, extraLeaveDeduction: extra > 0 ? Number(draft.extraLeaveDeduction) || 0 : 0 }, payrollMonth);
};
const payrollDraftLoanDeduction = (draft, payrollMonth = MONTH) => {
  const currentBalance = loanBalance(draft);
  const newLoan = currentBalance ? 0 : Math.max(0, Number(draft.newLoanAmount) || 0);
  const person = currentBalance
    ? isPositiveInteger(draft.newLoanMonths)
      ? { ...draft, loanTermMonths: (Number(draft.loanMonthsPaid) || 0) + Number(draft.newLoanMonths) }
      : draft
    : newLoan > 0
      ? {
        ...draft,
        loanPrincipal: newLoan,
        loanBalance: newLoan,
        loanTermMonths: Number(draft.newLoanMonths) || loanTermMonths(draft),
        loanMonthsPaid: 0,
        loanLastPaidMonth: null,
        loanLastDeduction: 0,
      }
      : draft;
  return loanDeduction(person, payrollMonth);
};
const payrollDraftAdminNetSalary = (draft, payrollMonth = MONTH) => {
  const newLoan = loanBalance(draft) ? 0 : Math.max(0, Number(draft.newLoanAmount) || 0);
  const person = {
    ...draft,
    salary: Number(draft.salaryText) || 0,
    ef: Number(draft.efText) || 0,
    esi: Number(draft.esiText) || 0,
    pf: Number(draft.pfText) || 0,
    ...(loanBalance(draft) > 0 && isPositiveInteger(draft.newLoanMonths) ? {
      loanTermMonths: (Number(draft.loanMonthsPaid) || 0) + Number(draft.newLoanMonths),
    } : {}),
    ...(newLoan > 0 ? {
      loanPrincipal: newLoan,
      loanBalance: newLoan,
      loanTermMonths: Number(draft.newLoanMonths) || loanTermMonths(draft),
      loanMonthsPaid: 0,
      loanLastPaidMonth: null,
      loanLastDeduction: 0,
    } : {}),
  };
  return adminNetSalary(person, payrollMonth);
};
const currentDate = () => new Date().toISOString().slice(0, 10);
const localDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const isValidLocalDateKey = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  return localDateKey(new Date(year, month - 1, day)) === value;
};
const calendarWeeks = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const cells = Array(new Date(year, month, 1).getDay()).fill(null)
    .concat(Array.from({ length: new Date(year, month + 1, 0).getDate() }, (_, index) => index + 1));
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
};
const replaceAttendanceRecord = (history, record) => [
  ...(Array.isArray(history) ? history : []).filter((item) => item.date !== record.date),
  record,
];
const paymentValidationError = (method, details = {}) => {
  if (!['NEFT', 'UPI', 'Cash'].includes(method)) return 'Select a salary payment method.';
  const paymentDate = String(details.paymentDate || '');
  const dateParts = /^\d{4}-\d{2}-\d{2}$/.test(paymentDate) ? paymentDate.split('-').map(Number) : [];
  const parsedDate = dateParts.length === 3 ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2]) : null;
  if (!parsedDate || parsedDate.getFullYear() !== dateParts[0] || parsedDate.getMonth() !== dateParts[1] - 1 || parsedDate.getDate() !== dateParts[2]) return 'Enter a valid payment date in YYYY-MM-DD format.';
  if (method === 'NEFT') {
    if (!details.accountHolder?.trim() || !details.bankName?.trim()) return 'Enter the NEFT account holder and bank name.';
    if (!/^\d{6,20}$/.test(String(details.accountNumber || ''))) return 'Enter a valid NEFT account number (6–20 digits).';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(details.ifsc || '').trim().toUpperCase())) return 'Enter a valid 11-character IFSC code.';
    if (!/^[A-Z0-9-]{6,30}$/i.test(String(details.transactionReference || '').trim())) return 'Enter the NEFT UTR / transaction reference.';
  }
  if (method === 'UPI') {
    if (!['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Other'].includes(details.upiProvider)) return 'Select the UPI app used for payment.';
    if (!/^[\w.-]+@[\w.-]+$/.test(String(details.upiId || '').trim())) return 'Enter a valid beneficiary UPI ID.';
    if (!/^[A-Z0-9-]{6,30}$/i.test(String(details.transactionReference || '').trim())) return 'Enter the UPI transaction reference.';
  }
  if (method === 'Cash' && (!details.receivedBy?.trim() || !details.receiptNumber?.trim())) return 'Enter who received the cash and the receipt / voucher number.';
  return '';
};
const timeToMinutes = (value) => {
  const match = String(value || '').match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  return match ? Number(match[1]) * 60 + Number(match[2]) : null;
};
const biometricRecordValue = (record, names) => {
  for (const name of names) {
    if (record?.[name] !== undefined && record?.[name] !== null && String(record[name]).trim()) return String(record[name]).trim();
  }
  return '';
};
const biometricEventDirection = (record) => {
  const raw = biometricRecordValue(record, ['direction', 'punchType', 'punch', 'eventType', 'event', 'type', 'status', 'checkType', 'state']);
  const normalized = raw.toLowerCase().replace(/[_-]/g, ' ');
  const numeric = Number(raw);
  if (raw && Number.isFinite(numeric)) return numeric === 0 ? 'in' : 'out';
  if (/(check\s*out|punch\s*out|clock\s*out|out\b|exit)/.test(normalized)) return 'out';
  if (/(check\s*in|punch\s*in|clock\s*in|\bin\b|entry)/.test(normalized)) return 'in';
  return '';
};
const biometricEventDateAndTime = (record, fallbackDate) => {
  const rawDate = biometricRecordValue(record, ['timestamp', 'dateTime', 'datetime', 'time', 'date']);
  const timeOnly = biometricRecordValue(record, ['punchTime', 'punch_time', 'clockTime', 'clock_time']);
  let date = fallbackDate;
  let time = '';
  if (rawDate) {
    const iso = new Date(rawDate);
    if (!Number.isNaN(iso.getTime())) {
      date = localDateKey(iso);
      time = `${String(iso.getHours()).padStart(2, '0')}:${String(iso.getMinutes()).padStart(2, '0')}`;
    } else {
      const dateTimeMatch = rawDate.match(/(\d{4}-\d{2}-\d{2})[T\s]+(\d{1,2}:\d{2})/);
      if (dateTimeMatch) {
        date = dateTimeMatch[1];
        time = dateTimeMatch[2].padStart(5, '0');
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) date = rawDate;
    }
  }
  if (!time && timeOnly) {
    const timeMatch = timeOnly.match(/(\d{1,2}:\d{2})/);
    if (timeMatch) time = timeMatch[1].padStart(5, '0');
  }
  if (!time) {
    const separateTime = biometricRecordValue(record, ['time', 'punchTime', 'punch_time', 'clockTime', 'clock_time']);
    const timeMatch = separateTime.match(/(\d{1,2}:\d{2})/);
    if (timeMatch) time = timeMatch[1].padStart(5, '0');
  }
  return { date, time };
};
const parseShiftTimes = (shift) => {
  const match = String(shift || '').trim().match(/^(\d{1,2}(?::[0-5]\d)?\s*(?:am|pm)?)\s*(?:to|[-–—])\s*(\d{1,2}(?::[0-5]\d)?\s*(?:am|pm)?)$/i);
  if (!match) return null;

  const parseTime = (value) => {
    const time = value.trim().match(/^(\d{1,2})(?::([0-5]\d))?\s*(am|pm)?$/i);
    if (!time) return null;
    const hour = Number(time[1]);
    const minutes = Number(time[2] || 0);
    const meridiem = (time[3] || '').toLowerCase();
    if (meridiem) {
      if (hour < 1 || hour > 12) return null;
      return (hour % 12 + (meridiem === 'pm' ? 12 : 0)) * 60 + minutes;
    }
    if (hour > 23 || (!time[2] && hour > 12)) return null;
    return hour * 60 + minutes;
  };

  const start = parseTime(match[1]);
  let end = parseTime(match[2]);
  if (start === null || end === null) return null;
  const twelveHourShift = !match[1].includes(':') && !/(am|pm)/i.test(match[1])
    && !match[2].includes(':') && !/(am|pm)/i.test(match[2]);
  if (twelveHourShift && end <= start && end < 12 * 60) end += 12 * 60;
  return { start, end, twelveHourShift };
};
const punchMinutesNearShift = (value, target, twelveHourShift) => {
  const minutes = timeToMinutes(value);
  if (minutes === null || !twelveHourShift) return minutes;
  return [minutes - 720, minutes, minutes + 720, minutes + 1440]
    .reduce((closest, candidate) => Math.abs(candidate - target) < Math.abs(closest - target) ? candidate : closest);
};
const nextAttendanceDate = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return localDateKey(new Date(year, month - 1, day + 1));
};
const punchedOutAfterShift = (record, fallbackShift) => {
  const shift = parseShiftTimes(record.shift || fallbackShift);
  if (!shift) return false;
  const scheduledEnd = shift.end >= shift.start ? shift.end : shift.end + 1440;
  const punchOut = punchMinutesNearShift(record.punchOut, scheduledEnd, shift.twelveHourShift);
  if (punchOut === null) return false;
  const normalizedPunchOut = shift.end < shift.start && punchOut < shift.start ? punchOut + 1440 : punchOut;
  return normalizedPunchOut >= scheduledEnd;
};
const attendanceDayComplete = (employees, admins, attendanceDate) => {
  const assignedEmployees = employees.filter((employee) => admins.some((admin) => admin.id === employee.adminId));
  const records = [
    ...assignedEmployees.map((employee) => ({
      person: employee,
      record: (Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : []).find((item) => item.date === attendanceDate && !item.demo),
    })),
    ...admins.map((admin) => ({
      person: admin,
      record: (Array.isArray(admin.attendanceHistory) ? admin.attendanceHistory : []).find((item) => item.date === attendanceDate),
    })),
  ];
  return records.length > 0 && records.every(({ person, record }) => {
    if (!record) return false;
    if (record.attendance === 'Absent' || record.attendance === 'On leave') return true;
    return ['Present', 'Late'].includes(record.attendance) && punchedOutAfterShift(record, person.shift);
  });
};
const attendanceTone = (status) => status === 'Present' ? 'green' : status === 'Late' ? 'amber' : status === 'Not recorded' ? 'blue' : 'red';
const currentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};
const lunchBreakMinutes = (employee) => {
  const lunchOut = timeToMinutes(employee.lunchOut);
  const lunchIn = timeToMinutes(employee.lunchIn);
  return lunchOut === null || lunchIn === null || lunchIn < lunchOut ? null : lunchIn - lunchOut;
};
const formatDuration = (minutes) => {
  if (minutes === null) return '—';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (hours && remainingMinutes) return `${hours} hr ${remainingMinutes} min`;
  if (hours) return `${hours} hr`;
  return `${remainingMinutes} min`;
};
const lateByMinutes = (punchIn, shift) => {
  const shiftStart = String(shift || '').match(/\b([01]?\d|2[0-3]):[0-5]\d\b/);
  const actual = timeToMinutes(punchIn);
  const scheduled = shiftStart ? timeToMinutes(shiftStart[0]) : null;
  return actual === null || scheduled === null ? null : Math.max(0, actual - scheduled);
};
const employeeOvertimeMinutes = (employee) => {
  const difference = overTimingMinutes(employee);
  if (difference !== null) return difference;
  const lateMinutes = lateByMinutes(employee.punchIn, employee.shift);
  return lateMinutes === null ? null : lateMinutes === 0 ? 0 : -lateMinutes;
};
const employeeOvertimeBonus = (employee) => {
  const difference = employeeOvertimeMinutes(employee);
  return difference === null ? 0 : difference * 5;
};
const overTiming = (employee) => {
  const difference = overTimingMinutes(employee);
  if (difference === null) return null;
  if (difference === 0) return '—';

  const sign = difference > 0 ? '+' : '-';
  return `${sign}${formatDuration(Math.abs(difference))}`;
};
const overTimingMinutes = (employee) => {
  const shiftTimes = parseShiftTimes(employee.shift);
  if (!shiftTimes) return null;
  const { start: shiftStart, end: shiftEnd, twelveHourShift } = shiftTimes;
  const scheduledEnd = shiftEnd >= shiftStart ? shiftEnd : shiftEnd + 24 * 60;
  const punchIn = punchMinutesNearShift(employee.punchIn, shiftStart, twelveHourShift);
  const punchOut = punchMinutesNearShift(employee.punchOut, scheduledEnd, twelveHourShift);
  if (punchIn === null || punchOut === null) return null;

  const scheduledMinutes = shiftEnd >= shiftStart ? shiftEnd - shiftStart : (24 * 60 - shiftStart) + shiftEnd;
  const normalizedPunchOut = punchOut >= punchIn ? punchOut : punchOut + 24 * 60;
  const workedMinutes = normalizedPunchOut - punchIn;
  return workedMinutes - scheduledMinutes;
};
const overtimeBonus = (employee) => {
  const difference = overTimingMinutes(employee);
  return difference === null ? 0 : difference * 5;
};
const formatOvertimeMinutes = (minutes) => minutes === null || minutes === 0
  ? '—'
  : `${minutes > 0 ? '+' : '-'}${formatDuration(Math.abs(minutes))}`;
const overtimeMinutesForRecord = (record, employee) => Number.isFinite(record.overtimeMinutes)
  ? record.overtimeMinutes
  : overTimingMinutes({ ...employee, ...record, shift: record.shift || employee.shift });
const lateMinutesForRecord = (record, employee) => lateByMinutes(record.punchIn, record.shift || employee.shift);
const formatDemoClockTime = (minutes) => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(normalized / 60)).padStart(2, '0')}:${String(normalized % 60).padStart(2, '0')}`;
};
const demoAttendanceOverrides = {
  e1: { 6: { attendance: 'On leave', leaveType: 'Annual', leaveDays: 1 }, 19: { attendance: 'On leave', extraLeaveDays: 1 } },
  e2: { 10: { attendance: 'On leave', leaveType: 'Sick', leaveDays: 1 }, 24: { attendance: 'Absent' } },
  e3: { 11: { attendance: 'On leave', leaveType: 'Emergency', leaveDays: 1, extraLeaveDays: 1 }, 17: { attendance: 'Absent' } },
  e4: { 13: { attendance: 'On leave', leaveType: 'Annual', leaveDays: 1 }, 26: { attendance: 'On leave', extraLeaveDays: 1 } },
  e5: { 12: { attendance: 'On leave', leaveType: 'Sick', leaveDays: 1 }, 20: { attendance: 'On leave', extraLeaveDays: 1 } },
  e6: { 9: { attendance: 'On leave', leaveType: 'Casual', leaveDays: 1 }, 18: { attendance: 'Absent' } },
  e7: { 5: { attendance: 'On leave', leaveType: 'Annual', leaveDays: 1 }, 20: { attendance: 'On leave', extraLeaveDays: 2 } },
  e8: { 16: { attendance: 'On leave', leaveType: 'Casual', leaveDays: 1 }, 23: { attendance: 'Absent' } },
};
const createDemoAttendanceHistory = (employee) => {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const [monthName, yearValue] = MONTH.split(' ');
  const year = Number(yearValue);
  const month = monthNames.indexOf(monthName);
  const shift = parseShiftTimes(employee.shift);
  const assignedAdmin = initialAdmins.find((admin) => admin.id === employee.adminId);
  if (month < 0 || !shift || !assignedAdmin) return [];

  const punchInOffsets = [-5, 0, 4, 8, -2, 2, 0, -6, 5, -3];
  const punchOutOffsets = [12, -4, 0, 8, 15, -8, 4, 1, -2, 10];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (new Date(year, month, day).getDay() === 0) return null;

    const override = demoAttendanceOverrides[employee.id]?.[day];
    let record;
    if (override) {
      record = {
        date,
        attendance: override.attendance,
        punchIn: '—',
        punchOut: '—',
        breakIn: '—',
        breakOut: '—',
        lunchOut: '—',
        lunchIn: '—',
        leaveType: override.leaveType || null,
        leaveDays: override.leaveDays || 0,
        extraLeaveDays: override.extraLeaveDays || 0,
        shift: employee.shift,
      };
    } else {
      const employeeIndex = Number(employee.id.slice(1)) - 1;
      const punchInOffset = punchInOffsets[(day + employeeIndex) % punchInOffsets.length];
      const punchOutOffset = punchOutOffsets[(day * 3 + employeeIndex) % punchOutOffsets.length];
      const punchIn = formatDemoClockTime(shift.start + punchInOffset);
      const punchOut = formatDemoClockTime(shift.end + punchOutOffset);
      const breakStart = shift.start + 210;
      record = {
        date,
        attendance: punchInOffset > 0 ? 'Late' : 'Present',
        punchIn,
        punchOut,
        breakIn: formatDemoClockTime(breakStart),
        breakOut: formatDemoClockTime(breakStart + 30),
        lunchOut: '—',
        lunchIn: '—',
        leaveType: null,
        leaveDays: 0,
        extraLeaveDays: 0,
        shift: employee.shift,
      };
    }

    return {
      ...record,
      overtimeMinutes: overTimingMinutes({ ...employee, ...record }),
      updatedBy: assignedAdmin.name,
      adminId: assignedAdmin.id,
      updatedAt: new Date(year, month, day, 17).toISOString(),
      demo: true,
    };
  }).filter(Boolean);
};
const initialEmployeesWithDemoHistory = initialEmployees.map((employee) => ({
  ...employee,
  attendanceHistory: createDemoAttendanceHistory(employee),
}));
const addMissingDemoHistory = (employee, workspaceAdmins = initialAdmins) => {
  const demoEmployee = initialEmployeesWithDemoHistory.find((item) => item.id === employee.id);
  if (!demoEmployee) return employee;
  const assignedAdmin = workspaceAdmins.find((admin) => admin.id === employee.adminId);
  const records = new Map(demoEmployee.attendanceHistory.map((record) => [
    record.date,
    assignedAdmin ? { ...record, adminId: assignedAdmin.id, updatedBy: assignedAdmin.name } : record,
  ]));
  (Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : []).forEach((record) => {
    if (record && record.date) records.set(record.date, record);
  });
  return { ...employee, attendanceHistory: [...records.values()].sort((first, second) => first.date.localeCompare(second.date)) };
};
const countedLeaveDays = (leaves = []) => leaves.reduce((sum, leave) => sum + (leave.type === 'Casual' ? 0 : Number(leave.days || 0)), 0);
const emergencyDays = (leaves = []) => leaves.filter((leave) => leave.type === 'Emergency').reduce((sum, leave) => sum + Number(leave.days || 0), 0);
const isNonNegativeNumber = (value) => value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0;
const isPositiveInteger = (value) => value !== '' && Number.isSafeInteger(Number(value)) && Number(value) > 0;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const receiptTableRows = (rows) => rows.map(([label, value]) => `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join('');
const paymentReceiptRows = (record) => {
  if (!record.paid) return [['Payment status', 'Pending — no payout is recorded'], ['Payment method', 'Not recorded']];
  const details = record.paymentDetails || {};
  const rows = [
    ['Payment status', 'Paid'],
    ['Payment method', record.paymentMethod || 'Not recorded'],
    ['Payment date', details.paymentDate || 'Not recorded'],
  ];
  if (record.paymentMethod === 'NEFT') {
    rows.push(
      ['Bank', details.bankName || 'Not recorded'],
      ['Account ending', details.accountNumber ? `•••• ${String(details.accountNumber).slice(-4)}` : 'Not recorded'],
      ['UTR / transaction reference', details.transactionReference || 'Not recorded'],
    );
  } else if (record.paymentMethod === 'UPI') {
    rows.push(
      ['UPI app', details.upiProvider || 'Not recorded'],
      ['Transaction reference', details.transactionReference || 'Not recorded'],
    );
  } else if (record.paymentMethod === 'Cash') {
    rows.push(
      ['Received by', details.receivedBy || 'Not recorded'],
      ['Receipt / voucher number', details.receiptNumber || 'Not recorded'],
    );
  }
  return rows;
};
const buildSalaryReceiptHtml = ({ period, recipientName, recipientSubtitle, paid, netPay, sections, notes }) => {
  const sectionHtml = sections.map(({ title, rows }) => `<section><h2>${escapeHtml(title)}</h2><table>${receiptTableRows(rows)}</table></section>`).join('');
  const noteHtml = notes.map((note) => `<li>${escapeHtml(note)}</li>`).join('');
  const documentTitle = `${paid ? 'Salary payment receipt' : 'Salary statement'} - ${recipientName} - ${period}`;
  return `<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(documentTitle)}</title><style>
    @page{size:A4;margin:14mm}*{box-sizing:border-box}body{margin:0;background:#eef2f7;color:#16243a;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55}.receipt{max-width:780px;margin:26px auto;background:#fff;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;box-shadow:0 12px 32px rgba(20,35,59,.09)}header{display:flex;justify-content:space-between;align-items:center;padding:24px 30px;background:#14233b;color:#fff}.brand{display:flex;align-items:center;gap:12px;font-size:17px;font-weight:700}.mark{display:flex;width:34px;height:34px;align-items:center;justify-content:center;border-radius:10px;background:#fff;color:#3765d8;font-weight:800;font-size:18px}.brand small{display:block;color:#b9c7da;font-size:8px;letter-spacing:1.2px;margin-top:2px}.status{border-radius:20px;padding:6px 11px;font-size:9px;font-weight:700;letter-spacing:.6px;background:${paid ? '#dff4e8' : '#fff1d8'};color:${paid ? '#13764f' : '#9a5d0b'}}main{padding:28px 30px 30px}.eyebrow{color:#3765d8;font-size:9px;font-weight:800;letter-spacing:1.3px}h1{font-size:24px;line-height:1.2;margin:5px 0;color:#14233b} .period{color:#64748b;font-size:12px;margin:0 0 20px}.recipient{display:flex;justify-content:space-between;gap:18px;padding:14px 16px;margin-bottom:22px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}.recipient strong{display:block;font-size:14px;color:#14233b}.recipient span{display:block;color:#64748b;font-size:10px;margin-top:3px}.amount{padding:16px 18px;margin:18px 0 22px;border-radius:10px;background:#edf3ff;border:1px solid #dce6ff}.amount span{display:block;color:#52637c;font-size:9px;font-weight:800;letter-spacing:.8px}.amount strong{display:block;color:#244fc1;font-size:23px;margin-top:3px}section{margin-top:20px;page-break-inside:avoid}h2{font-size:12px;color:#14233b;margin:0 0 8px}table{width:100%;border-collapse:collapse}td{padding:8px 10px;border-bottom:1px solid #edf1f5;vertical-align:top}td:first-child{width:58%;color:#52637c}td:last-child{text-align:right;font-weight:600;color:#1c2b43}.notes{margin-top:21px;padding:13px 15px;border-radius:9px;background:#f5f7fa;color:#5d6b80;font-size:10px}.notes strong{display:block;color:#34445c;margin-bottom:4px}.notes ul{padding-left:17px;margin:4px 0 0}.notes li{margin:3px 0}.footer{border-top:1px solid #e2e8f0;margin-top:22px;padding-top:12px;color:#8190a4;font-size:9px;display:flex;justify-content:space-between;gap:10px}@media print{body{background:#fff}.receipt{max-width:none;margin:0;border:0;border-radius:0;box-shadow:none}header{print-color-adjust:exact;-webkit-print-color-adjust:exact}.amount,.notes,.status{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
  </style></head><body><div class="receipt"><header><div class="brand"><div class="mark">H</div><div>HRMS Organisation<small>PEOPLE OPERATIONS</small></div></div><div class="status">${paid ? 'PAID' : 'PAYMENT PENDING'}</div></header><main><div class="eyebrow">PAYROLL DOCUMENT</div><h1>${escapeHtml(paid ? 'Salary payment receipt' : 'Salary statement')}</h1><p class="period">${escapeHtml(period)}</p><div class="recipient"><div><strong>${escapeHtml(recipientName)}</strong><span>${escapeHtml(recipientSubtitle)}</span></div><div><span>Document status</span><strong>${escapeHtml(paid ? 'Paid' : 'Pending')}</strong></div></div>${sectionHtml}<div class="amount"><span>FINAL NET SALARY PAYOUT</span><strong>${escapeHtml(netPay)}</strong></div><div class="notes"><strong>Calculation and record notes</strong><ul>${noteHtml}</ul></div><div class="footer"><span>Generated by HRMS Organisation</span><span>${escapeHtml(new Date().toLocaleString('en-IN'))}</span></div></main></div></body></html>`;
};
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function notify(message) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.alert(message);
  } else {
    Alert.alert('HRMS Organisation', message);
  }
}

function Button({ title, onPress, variant = 'primary', small = false, disabled = false }) {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.button, styles[`button_${variant}`], small && styles.buttonSmall, disabled && styles.buttonDisabled]}>
      <Text style={[styles.buttonText, styles[`buttonText_${variant}`], small && styles.buttonTextSmall]}>{title}</Text>
    </Pressable>
  );
}

function Badge({ children, tone = 'blue' }) {
  return <View style={[styles.badge, styles[`badge_${tone}`]]}><Text style={[styles.badgeText, styles[`badgeText_${tone}`]]}>{children}</Text></View>;
}

function Field({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline, editable = true }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || label}
        placeholderTextColor="#A0AABC"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        editable={editable}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

function PaymentMethodFields({ method, details = {}, amount, onMethodChange, onDetailsChange }) {
  const update = (field, value) => onDetailsChange({ ...details, [field]: value });
  return (
    <View style={styles.paymentForm}>
      <Text style={styles.fieldLabel}>Payment method</Text>
      <View style={styles.choiceRow}>{['NEFT', 'UPI', 'Cash'].map((option) => <Pressable key={option} onPress={() => onMethodChange(option)} style={[styles.choice, method === option && styles.choiceActive]}><Text style={[styles.choiceText, method === option && styles.choiceTextActive]}>{option}</Text></Pressable>)}</View>
      {amount !== undefined && amount !== null && <Text style={styles.calculatedNet}>Payment amount: {money(amount)}</Text>}
      {!!method && <Field label="Payment date · YYYY-MM-DD" value={details.paymentDate || ''} onChangeText={(value) => update('paymentDate', value)} placeholder={currentDate()} />}
      {method === 'NEFT' && <>
        <Text style={styles.bodyText}>Complete the bank transfer using these beneficiary details, then enter its UTR reference.</Text>
        <Field label="Account holder" value={details.accountHolder || ''} onChangeText={(value) => update('accountHolder', value)} />
        <Field label="Bank name" value={details.bankName || ''} onChangeText={(value) => update('bankName', value)} />
        <Field label="Account number" value={details.accountNumber || ''} onChangeText={(value) => update('accountNumber', value)} keyboardType="numeric" />
        <Field label="IFSC code" value={details.ifsc || ''} onChangeText={(value) => update('ifsc', value.toUpperCase())} />
        <Field label="UTR / transaction reference" value={details.transactionReference || ''} onChangeText={(value) => update('transactionReference', value)} />
      </>}
      {method === 'UPI' && <>
        <Text style={styles.bodyText}>Complete the UPI transfer outside this demo, then record its transaction reference.</Text>
        <Text style={styles.fieldLabel}>UPI app</Text>
        <View style={styles.choiceRow}>{['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Other'].map((provider) => <Pressable key={provider} onPress={() => update('upiProvider', provider)} style={[styles.choice, details.upiProvider === provider && styles.choiceActive]}><Text style={[styles.choiceText, details.upiProvider === provider && styles.choiceTextActive]}>{provider}</Text></Pressable>)}</View>
        <Field label="Beneficiary UPI ID" value={details.upiId || ''} onChangeText={(value) => update('upiId', value)} keyboardType="email-address" placeholder="name@bank" />
        <Field label="UPI transaction reference" value={details.transactionReference || ''} onChangeText={(value) => update('transactionReference', value)} />
      </>}
      {method === 'Cash' && <>
        <Text style={styles.bodyText}>Record the cash handover manually. Mark as paid after handing over the amount.</Text>
        <Field label="Received by" value={details.receivedBy || ''} onChangeText={(value) => update('receivedBy', value)} />
        <Field label="Receipt / voucher number" value={details.receiptNumber || ''} onChangeText={(value) => update('receiptNumber', value)} />
        <Field label="Cash payment notes (optional)" value={details.notes || ''} onChangeText={(value) => update('notes', value)} />
      </>}
      <Text style={styles.caption}>This prototype records payment instructions and references only; it does not initiate NEFT or UPI transfers.</Text>
    </View>
  );
}

function SectionTitle({ title, subtitle, action }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
  );
}

function Metric({ label, value, detail, tone = 'blue' }) {
  return (
    <View style={[styles.metric, styles[`metric_${tone}`]]}>
      <View style={[styles.metricMark, styles[`mark_${tone}`]]} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricDetail}>{detail}</Text>
    </View>
  );
}

function Empty({ text }) {
  return <View style={styles.empty}><Text style={styles.emptyText}>{text}</Text></View>;
}

function App() {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [savedWorkspace] = useState(loadWorkspaceData);
  const savedAttendanceDate = savedWorkspace?.attendanceDate;
  const initialAttendanceDate = isValidLocalDateKey(savedAttendanceDate) ? savedAttendanceDate : localDateKey();
  const [superAdmins] = useState(initialSuperAdmins);
  const [admins, setAdmins] = useState(savedWorkspace ? savedWorkspace.admins : initialAdmins);
  const [employees, setEmployees] = useState(savedWorkspace ? savedWorkspace.employees.map((employee) => addMissingDemoHistory(employee, savedWorkspace.admins)) : initialEmployeesWithDemoHistory);
  const [publicEvents, setPublicEvents] = useState(savedWorkspace?.publicEvents || []);
  const [payrollMonth, setPayrollMonth] = useState(savedWorkspace?.payrollMonth || MONTH);
  const [attendanceDate, setAttendanceDate] = useState(initialAttendanceDate);
  const [biometricEndpoint, setBiometricEndpoint] = useState(savedWorkspace?.biometricEndpoint || '');
  const [biometricToken, setBiometricToken] = useState(savedWorkspace?.biometricToken || '');
  const rolledAttendanceDate = useRef(null);
  const [audit, setAudit] = useState(savedWorkspace ? savedWorkspace.audit : [{ id: id(), message: 'Workspace created with 2 admin teams and 8 employees.', actor: 'System', time: 'Today' }]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState('Overview');
  const [modal, setModal] = useState(null);
  const [draft, setDraft] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedAdminHistoryId, setSelectedAdminHistoryId] = useState(null);
  const [attendanceCalendarMonth, setAttendanceCalendarMonth] = useState(() => {
    const date = new Date(`${initialAttendanceDate}T00:00:00`);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(initialAttendanceDate);
  const [publicEventName, setPublicEventName] = useState('');
  const [publicEventDate, setPublicEventDate] = useState(localDateKey());
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify({ admins, employees, publicEvents, payrollMonth, attendanceDate, audit, biometricEndpoint, biometricToken }));
  }, [admins, employees, publicEvents, payrollMonth, attendanceDate, audit, biometricEndpoint, biometricToken]);

  const isSuper = user && user.role === 'super';
  const ownAdmin = admins.find((admin) => admin.id === (user && user.adminId));
  const hasPayrollAccess = !isSuper && ownAdmin?.accessModule === 'payroll';
  const visibleEmployees = isSuper
    ? employees
    : employees.filter((employee) => ownAdmin && ownAdmin.employeeIds.includes(employee.id));
  const filteredEmployees = visibleEmployees.filter((employee) => `${employee.name} ${employee.email} ${employee.department}`.toLowerCase().includes(filter.toLowerCase()));
  const canManageEmployee = (employeeId) => !!(isSuper || (!hasPayrollAccess && ownAdmin && ownAdmin.employeeIds.includes(employeeId)));

  const log = (message) => setAudit((current) => [{ id: id(), message, actor: user ? user.name : 'System', time: new Date().toLocaleDateString() }, ...current]);

  useEffect(() => {
    if (!attendanceDayComplete(employees, admins, attendanceDate)) return;
    if (rolledAttendanceDate.current === attendanceDate) return;
    rolledAttendanceDate.current = attendanceDate;
    const nextDate = nextAttendanceDate(attendanceDate);
    setEmployees((current) => current.map((employee) => ({
      ...employee,
      attendance: 'Not recorded',
      punchIn: '—',
      punchOut: '—',
      breakIn: '—',
      breakOut: '—',
      lunchOut: '—',
      lunchIn: '—',
      overtime: 0,
    })));
    setAdmins((current) => current.map((admin) => ({
      ...admin,
      attendance: 'Not recorded',
      punchIn: '—',
      punchOut: '—',
      breakIn: '—',
      breakOut: '—',
      lunchOut: '—',
      lunchIn: '—',
      overtime: 0,
    })));
    setAttendanceDate(nextDate);
    setAttendanceCalendarMonth(new Date(`${nextDate}T00:00:00`));
    setSelectedAttendanceDate(nextDate);
    log(`All required attendance records are complete for ${attendanceDate}; opened ${nextDate}.`);
  }, [admins, employees, attendanceDate]);

  const advancePayrollMonth = () => {
    if (!isSuper) return notify('Only the Super Admin can advance the payroll month.');
    if (employees.some((employee) => !employee.paid) || admins.some((admin) => !admin.paid)) {
      return notify('Mark all employee and admin salaries as paid before advancing the payroll month.');
    }
    const nextMonth = nextPayrollMonth(payrollMonth);
    setPayrollMonth(nextMonth);
    setEmployees((current) => current.map((employee) => ({ ...employee, paid: false, paymentMethod: '', paymentDetails: {} })));
    setAdmins((current) => current.map((admin) => ({ ...admin, paid: false, paymentMethod: '', paymentDetails: {} })));
    log(`Advanced payroll from ${payrollMonth} to ${nextMonth}.`);
  };

  const signIn = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const superAdmin = superAdmins.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
    if (superAdmin) {
      setUser({ role: 'super', name: superAdmin.name, superAdminId: superAdmin.id });
      setTab('Overview');
      setLoginError('');
      return;
    }
    const admin = admins.find((item) => item.email.toLowerCase() === normalizedEmail && item.password === password);
    if (admin) {
      setUser({ role: 'admin', name: admin.name, adminId: admin.id });
      setTab('Overview');
      setLoginError('');
      return;
    }
    setLoginError('Email or password is not valid. Employee accounts cannot sign in to this workspace.');
  };

  const updateEmployee = (employeeId, patch) => {
    setEmployees((current) => current.map((employee) => {
      if (employee.id !== employeeId) return employee;
      const updatedEmployee = { ...employee, ...patch };
      return { ...updatedEmployee, overtime: employeeOvertimeBonus(updatedEmployee) };
    }));
  };

  const updateAdmin = (adminId, patch) => {
    setAdmins((current) => current.map((admin) => {
      if (admin.id !== adminId) return admin;
      const updatedAdmin = { ...admin, ...patch };
      return { ...updatedAdmin, overtime: overtimeBonus(updatedAdmin) };
    }));
  };

  const updateAdminAttendance = (admin, patch) => {
    const updatedAdmin = { ...admin, ...patch };
    const record = {
      date: attendanceDate,
      attendance: updatedAdmin.attendance || 'Not recorded',
      punchIn: updatedAdmin.punchIn || '—',
      punchOut: updatedAdmin.punchOut || '—',
      breakIn: updatedAdmin.breakIn || '—',
      breakOut: updatedAdmin.breakOut || '—',
      lunchOut: updatedAdmin.lunchOut || '—',
      lunchIn: updatedAdmin.lunchIn || '—',
      shift: updatedAdmin.shift || '',
      leaves: updatedAdmin.leaves || [],
      updatedBy: user?.name || 'Super Admin',
      updatedAt: new Date().toISOString(),
    };
    updateAdmin(admin.id, { ...patch, attendanceHistory: replaceAttendanceRecord(admin.attendanceHistory, record) });
  };

  const updateEmployeeDailyRecord = (employee, patch) => {
    const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : [];
    const currentRecord = history.find((record) => record.date === attendanceDate && !record.demo);
    if (!currentRecord) return false;
    const record = {
      ...currentRecord,
      ...patch,
      updatedBy: ownAdmin?.name || user?.name || 'Admin',
      updatedAt: new Date().toISOString(),
    };
    updateEmployee(employee.id, { ...patch, attendanceHistory: replaceAttendanceRecord(history, record) });
    return true;
  };

  const showModal = (kind, values = {}) => {
    if (isSuper && kind === 'attendance') {
      notify('Employee attendance is read-only for the Super Admin. The assigned admin manages these records.');
      return;
    }
    if (!isSuper && ['newAdmin', 'editAdmin', 'team', 'replaceEmployee', 'adminAttendance', 'adminSalary'].includes(kind)) {
      notify('Only the Super Admin can manage admin-related data.');
      return;
    }
    if (!isSuper && kind === 'payroll') {
      notify('Only the Super Admin can edit employee payroll.');
      return;
    }
    if (!isSuper && values.id && ['attendance', 'editEmployee', 'employeeDetail'].includes(kind) && !canManageEmployee(values.id)) {
      notify('Attendance access is not enabled for your admin account.');
      return;
    }
    setDraft(values);
    setModal(kind);
  };

  const syncBiometricAttendance = async () => {
    const endpoint = String(biometricEndpoint || '').trim();
    if (!/^https?:\/\//i.test(endpoint)) return notify('Enter a valid biometric device API URL starting with http:// or https://.');

    try {
      const headers = { Accept: 'application/json' };
      if (String(biometricToken || '').trim()) headers.Authorization = `Bearer ${biometricToken.trim()}`;
      const response = await fetch(endpoint, { headers });
      if (!response.ok) throw new Error(`Biometric API returned ${response.status}`);
      const payload = await response.json();
      const records = Array.isArray(payload)
        ? payload
        : payload.records || payload.events || payload.logs || payload.data || payload.attendance || [];
      if (!Array.isArray(records)) throw new Error('Biometric API response did not contain a records array.');

      const todayRecords = records.filter((record) => {
        const event = biometricEventDateAndTime(record, attendanceDate);
        return event.date === attendanceDate && /^([01]?\d|2[0-3]):[0-5]\d$/.test(event.time);
      });
      let employeeUpdates = 0;
      let adminUpdates = 0;

      const personMatches = (record, person) => {
        const recordIdentifiers = [
          biometricRecordValue(record, ['employeeId', 'adminId', 'userId', 'personId', 'user_id', 'pin', 'enrollmentId', 'employeeCode', 'email']),
          biometricRecordValue(record, ['name']),
        ].filter(Boolean).map((value) => value.toLowerCase());
        const personIdentifiers = [
          String(person.id || ''),
          person.name || '',
          person.email || '',
          person.pin || '',
          person.employeeCode || '',
        ].filter(Boolean).map((value) => value.toLowerCase());
        return recordIdentifiers.some((value) => personIdentifiers.includes(value));
      };

      setEmployees((current) => current.map((employee) => {
        if (!isSuper && !ownAdmin?.employeeIds.includes(employee.id)) return employee;
        const events = todayRecords.filter((record) => personMatches(record, employee));
        if (!events.length) return employee;
        const punchesIn = events
          .filter((record) => biometricEventDirection(record) === 'in')
          .map((record) => biometricEventDateAndTime(record, attendanceDate).time)
          .sort();
        const punchesOut = events
          .filter((record) => biometricEventDirection(record) === 'out')
          .map((record) => biometricEventDateAndTime(record, attendanceDate).time)
          .sort();
        if (!punchesIn.length && !punchesOut.length) return employee;

        const punchIn = punchesIn[0] || employee.punchIn || '—';
        const punchOut = punchesOut.length ? punchesOut[punchesOut.length - 1] : '—';
        const attendance = punchIn !== '—' && lateByMinutes(punchIn, employee.shift) > 0 ? 'Late' : 'Present';
        const patch = { attendance, punchIn, punchOut };
        const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : [];
        const currentRecord = history.find((record) => record.date === attendanceDate && !record.demo);
        const record = {
          ...(currentRecord || {}),
          date: attendanceDate,
          attendance,
          punchIn,
          punchOut,
          breakIn: employee.breakIn || '—',
          breakOut: employee.breakOut || '—',
          lunchOut: employee.lunchOut || '—',
          lunchIn: employee.lunchIn || '—',
          shift: employee.shift,
          updatedBy: ownAdmin?.name || user?.name || 'Biometric device',
          adminId: employee.adminId,
          source: 'Biometric',
          updatedAt: new Date().toISOString(),
        };
        record.overtimeMinutes = overTimingMinutes({ ...employee, ...record });
        employeeUpdates += 1;
        return { ...employee, ...patch, overtime: employeeOvertimeBonus({ ...employee, ...patch }), attendanceHistory: replaceAttendanceRecord(history, record) };
      }));

      if (isSuper) {
        setAdmins((current) => current.map((admin) => {
          const events = todayRecords.filter((record) => personMatches(record, admin));
          if (!events.length) return admin;
          const punchesIn = events
            .filter((record) => biometricEventDirection(record) === 'in')
            .map((record) => biometricEventDateAndTime(record, attendanceDate).time)
            .sort();
          const punchesOut = events
            .filter((record) => biometricEventDirection(record) === 'out')
            .map((record) => biometricEventDateAndTime(record, attendanceDate).time)
            .sort();
          if (!punchesIn.length && !punchesOut.length) return admin;

          const punchIn = punchesIn[0] || admin.punchIn || '—';
          const punchOut = punchesOut.length ? punchesOut[punchesOut.length - 1] : '—';
          const attendance = punchIn !== '—' && lateByMinutes(punchIn, admin.shift) > 0 ? 'Late' : 'Present';
          const patch = { attendance, punchIn, punchOut };
          const record = {
            date: attendanceDate,
            attendance,
            punchIn,
            punchOut,
            breakIn: admin.breakIn || '—',
            breakOut: admin.breakOut || '—',
            lunchOut: admin.lunchOut || '—',
            lunchIn: admin.lunchIn || '—',
            shift: admin.shift || '',
            leaves: admin.leaves || [],
            updatedBy: user?.name || 'Biometric device',
            source: 'Biometric',
            updatedAt: new Date().toISOString(),
          };
          adminUpdates += 1;
          return { ...admin, ...patch, overtime: overtimeBonus({ ...admin, ...patch }), attendanceHistory: replaceAttendanceRecord(admin.attendanceHistory, record) };
        }));
      }

      log(`Synced biometric attendance for ${attendanceDate}: ${employeeUpdates} employee${employeeUpdates === 1 ? '' : 's'}${isSuper ? ` and ${adminUpdates} admin${adminUpdates === 1 ? '' : 's'}` : ''} updated.`);
      notify(`Biometric sync complete. Updated ${employeeUpdates} employee${employeeUpdates === 1 ? '' : 's'}${isSuper ? ` and ${adminUpdates} admin${adminUpdates === 1 ? '' : 's'}` : ''}.`);
      setModal(null);
    } catch (error) {
      notify(`Biometric sync failed: ${error.message}`);
    }
  };

  const saveEmployee = () => {
    if (!isSuper && !canManageEmployee(draft.id)) return notify('You can only manage employees assigned to your admin account.');
    if (!draft.name || !draft.email) return notify('Name and email are required.');
    updateEmployee(draft.id, { name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone || '', title: draft.title || '', department: draft.department || '', shift: draft.shift || '09:00 – 17:00' });
    log(`Updated personal information for ${draft.name}.`);
    setModal(null);
  };

  const saveAttendance = () => {
    if (isSuper) return notify('Employee attendance is read-only for the Super Admin.');
    const employee = employees.find((item) => item.id === draft.id);
    if (!employee) return setModal(null);
    if (!canManageEmployee(employee.id)) return notify('You can only manage employees assigned to your admin account.');
    if (!['Present', 'Late', 'On leave', 'Absent'].includes(draft.attendance)) return notify('Select a valid attendance status.');
    const leaveType = draft.leaveType || 'None';
    const leaveDays = Number(draft.leaveDays);
    const extraLeaves = Number(draft.extraLeaves);
    if (leaveType !== 'None' && (!Number.isFinite(leaveDays) || leaveDays < 0)) return notify('Enter a valid leave duration.');
    if (!Number.isFinite(extraLeaves) || extraLeaves < 0) return notify('Enter a valid extra-leave duration.');

    let leaves = (employee.leaves || [])
      .map((leave) => ({ ...leave }))
      .filter((leave) => leave.type !== 'Unpaid');
    leaves = leaves.filter((leave) => leave.type !== leaveType);
    if (leaveType !== 'None' && leaveDays > 0) leaves.push({ type: leaveType, days: leaveDays });
    if (extraLeaves > 0) leaves.push({ type: 'Unpaid', days: extraLeaves, extraDays: extraLeaves });

    const recordForToday = (times) => {
      const record = {
        date: attendanceDate,
        attendance: draft.attendance,
        punchIn: times.punchIn || '—',
        punchOut: times.punchOut || '—',
        breakIn: times.breakIn || '—',
        breakOut: times.breakOut || '—',
        lunchOut: times.lunchOut || employee.lunchOut || '—',
        lunchIn: times.lunchIn || employee.lunchIn || '—',
        leaveType: leaveType !== 'None' && leaveDays > 0 ? leaveType : null,
        leaveDays: leaveType !== 'None' && leaveDays > 0 ? leaveDays : 0,
        extraLeaveDays: extraLeaves,
        shift: employee.shift,
        updatedBy: ownAdmin?.name || user?.name || 'Admin',
        adminId: ownAdmin?.id || null,
        updatedAt: new Date().toISOString(),
      };
      record.overtimeMinutes = overTimingMinutes({ ...employee, ...record });
      return replaceAttendanceRecord(employee.attendanceHistory, record);
    };

    if (draft.attendance === 'On leave' || draft.attendance === 'Absent') {
      const emptyTimes = { punchIn: '—', punchOut: '—', breakIn: '—', breakOut: '—', lunchOut: '—', lunchIn: '—' };
      updateEmployee(employee.id, {
        attendance: draft.attendance,
        ...emptyTimes,
        leaves,
        extraLeaveDeduction: calculateExtraLeaveDeduction(employee.base, extraLeaves),
        attendanceHistory: recordForToday(emptyTimes),
      });
      log(`Marked ${employee.name} ${draft.attendance === 'On leave' ? 'on leave' : 'absent'}; cleared punch and break times and updated leave records.`);
      setModal(null);
      return;
    }
    const fields = ['punchIn', 'punchOut', 'breakIn', 'breakOut'];
    const attendance = {};
    for (const field of fields) {
      const value = (draft[field] || '').trim() || '—';
      if (value !== '—' && !/^([01]?\d|2[0-3]):[0-5]\d$/.test(value)) {
        return notify('Enter times in 24-hour HH:MM format, or leave the field blank.');
      }
      attendance[field] = value;
    }
    if (draft.attendance === 'Late') {
      if (attendance.punchIn === '—') return notify('Enter a punch-in time for a Late status.');
      const minutesLate = lateByMinutes(attendance.punchIn, employee.shift);
      if (minutesLate === null) return notify('Cannot calculate lateness. Check that the shift includes a start time such as 09:00.');
      if (minutesLate === 0) return notify('The punch-in is not later than the scheduled shift start. Select Present or correct the time.');
    }
    updateEmployee(employee.id, {
      ...attendance,
      attendance: draft.attendance,
      leaves,
      extraLeaveDeduction: calculateExtraLeaveDeduction(employee.base, extraLeaves),
      attendanceHistory: recordForToday(attendance),
    });
    log(draft.attendance === 'Late'
      ? `Marked ${employee.name} late by ${lateByMinutes(attendance.punchIn, employee.shift)} minutes and updated punch/break times.`
      : `Marked ${employee.name} present and updated punch/break times.`);
    setModal(null);
  };

  const saveAdminAttendance = () => {
    if (!isSuper) return notify('Only the Super Admin can manage admin attendance.');
    const admin = admins.find((item) => item.id === draft.id);
    if (!admin) return setModal(null);
    if (!['Present', 'Late', 'On leave', 'Absent'].includes(draft.attendance)) return notify('Select a valid attendance status.');

    const leaveType = draft.leaveType || 'None';
    const leaveDays = Number(draft.leaveDays);
    if (leaveType !== 'None' && (!Number.isFinite(leaveDays) || leaveDays < 0)) return notify('Enter a valid leave duration.');

    let leaves = (admin.leaves || []).map((leave) => ({ ...leave })).filter((leave) => leave.type !== leaveType);
    if (leaveType !== 'None' && leaveDays > 0) leaves.push({ type: leaveType, days: leaveDays, extraDays: leaveDays });

    if (draft.attendance === 'On leave' || draft.attendance === 'Absent') {
      updateAdminAttendance(admin, { attendance: draft.attendance, punchIn: '—', punchOut: '—', breakIn: '—', breakOut: '—', lunchOut: '—', lunchIn: '—', leaves });
      log(`Updated ${admin.name}'s attendance status and leave record.`);
      setModal(null);
      return;
    }

    const fields = ['punchIn', 'punchOut', 'breakIn', 'breakOut', 'lunchOut', 'lunchIn'];
    const attendance = {};
    for (const field of fields) {
      const value = (draft[field] || '').trim() || '—';
      if (value !== '—' && !/^([01]?\d|2[0-3]):[0-5]\d$/.test(value)) {
        return notify('Enter times in 24-hour HH:MM format, or leave the field blank.');
      }
      attendance[field] = value;
    }
    if (!draft.shift || !String(draft.shift).match(/\b([01]?\d|2[0-3]):[0-5]\d\s*[–-]\s*([01]?\d|2[0-3]):[0-5]\d\b/)) {
      return notify('Enter a valid shift such as 09:00 – 17:00.');
    }
    if (draft.attendance === 'Late') {
      const minutesLate = lateByMinutes(attendance.punchIn, draft.shift);
      if (minutesLate === null) return notify('Cannot calculate lateness. Check the punch-in time and shift.');
      if (minutesLate === 0) return notify('The punch-in is not later than the scheduled shift start.');
    }
    updateAdminAttendance(admin, { ...attendance, attendance: draft.attendance, shift: draft.shift.trim(), leaves });
    log(`Updated ${admin.name}'s admin attendance and allocated shift.`);
    setModal(null);
  };

  const recordAdminLunchPunch = (adminId, punchType) => {
    if (!isSuper) return notify('Only the Super Admin can record admin lunch punches.');
    const admin = admins.find((item) => item.id === adminId);
    if (!admin) return notify('Admin record was not found.');
    if (!['Present', 'Late'].includes(admin.attendance)) return notify('Lunch punches can only be recorded for admins marked Present or Late.');
    if (!(Array.isArray(admin.attendanceHistory) ? admin.attendanceHistory : []).some((record) => record.date === attendanceDate)) return notify('Save today’s admin attendance before recording lunch punches.');

    if (punchType === 'out') {
      const lunchOut = currentTime();
      updateAdminAttendance(admin, { lunchOut, lunchIn: '—' });
      log(`Recorded ${admin.name}'s lunch break out punch at ${lunchOut}.`);
      return;
    }

    if (!admin.lunchOut || admin.lunchOut === '—') return notify('Record the lunch out punch before the return punch.');
    const lunchIn = currentTime();
    const lunchOutMinutes = timeToMinutes(admin.lunchOut);
    const lunchInMinutes = timeToMinutes(lunchIn);
    if (lunchOutMinutes === null || lunchInMinutes === null || lunchInMinutes < lunchOutMinutes) {
      return notify('The lunch return punch cannot be earlier than the lunch out punch.');
    }
    updateAdminAttendance(admin, { lunchIn });
    log(`Recorded ${admin.name}'s lunch return punch at ${lunchIn} after ${lunchInMinutes - lunchOutMinutes} minutes.`);
  };

  const recordLunchPunch = (employeeId, punchType) => {
    if (isSuper) return notify('Employee lunch punches are read-only for the Super Admin.');
    const employee = employees.find((item) => item.id === employeeId);
    if (!employee) return notify('Employee record was not found.');
    if (!canManageEmployee(employee.id)) return notify('You can only manage lunch punches for employees assigned to your admin account.');
    if (!['Present', 'Late'].includes(employee.attendance)) return notify('Lunch punches can only be recorded for employees marked Present or Late.');
    if (!(Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : []).some((record) => record.date === attendanceDate && !record.demo)) return notify('Save today’s employee attendance before recording lunch punches.');

    if (punchType === 'out') {
      if (employee.lunchOut && employee.lunchOut !== '—') return notify('A lunch break has already been started for this employee today.');
      const lunchOut = currentTime();
      if (!updateEmployeeDailyRecord(employee, { lunchOut, lunchIn: '—' })) return notify('Save today’s employee attendance before recording lunch punches.');
      log(`Recorded ${employee.name}'s lunch break out punch at ${lunchOut}.`);
      return;
    }

    if (!employee.lunchOut || employee.lunchOut === '—') return notify('Record the lunch out punch before the return punch.');
    if (employee.lunchIn && employee.lunchIn !== '—') return notify('The lunch return punch has already been recorded.');
    const lunchIn = currentTime();
    const duration = timeToMinutes(lunchIn) - timeToMinutes(employee.lunchOut);
    if (duration < 0) return notify('The return punch time cannot be earlier than the lunch out punch.');
    if (!updateEmployeeDailyRecord(employee, { lunchIn })) return notify('Save today’s employee attendance before recording lunch punches.');
    log(`Recorded ${employee.name}'s lunch return punch at ${lunchIn} after ${duration} minutes.`);
  };

  const saveAdminProfile = () => {
    if (!isSuper) return notify('Only the Super Admin can manage admin profile data.');
    if (!draft.name || !draft.email) return notify('Name and email are required.');
    const normalizedEmail = draft.email.trim().toLowerCase();
    if (superAdmins.some((superAdmin) => superAdmin.email.toLowerCase() === normalizedEmail) || admins.some((admin) => admin.id !== draft.id && admin.email.toLowerCase() === normalizedEmail)) return notify('That email is already in use.');
    if (isSuper && draft.newPassword && !draft.newPassword.trim()) return notify('Enter a non-empty password.');
    const changes = { name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone || '', title: draft.title || '' };
    if (isSuper && draft.newPassword) changes.password = draft.newPassword.trim();
    changes.accessModule = 'attendance';
    updateAdmin(draft.id, changes);
    if (user && user.adminId === draft.id) setUser((current) => ({ ...current, name: draft.name.trim() }));
    log(`Updated admin profile for ${draft.name}.`);
    setModal(null);
  };

  const deleteAdminAccount = (admin) => {
    if (!isSuper) return notify('Only the Super Admin can delete admin accounts.');
    const assignedEmployees = employees.filter((employee) => admin.employeeIds.includes(employee.id) || employee.adminId === admin.id);
    const confirmation = `Delete ${admin.name}'s admin account and linked salary, attendance, payment, and loan records? ${assignedEmployees.length} assigned employee${assignedEmployees.length === 1 ? '' : 's'} will remain and become unassigned.`;
    const removeAdmin = () => {
      setAdmins((current) => current.filter((item) => item.id !== admin.id));
      setEmployees((current) => current.map((employee) => (
        admin.employeeIds.includes(employee.id) || employee.adminId === admin.id
          ? { ...employee, adminId: null }
          : employee
      )));
      log(`Deleted admin account for ${admin.name}; ${assignedEmployees.length} employee${assignedEmployees.length === 1 ? '' : 's'} returned to the unassigned pool.`);
    };

    if (Platform.OS === 'web') {
      if (typeof window === 'undefined' || !window.confirm(confirmation)) return;
      removeAdmin();
      return;
    }

    Alert.alert('Delete admin account?', confirmation, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: removeAdmin },
    ]);
  };

  const saveNewEmployee = () => {
    if (!draft.name || !draft.email) return notify('Name and email are required.');
    if (employees.some((employee) => employee.email.toLowerCase() === draft.email.trim().toLowerCase())) return notify('That employee email is already in use.');
    const employee = {
      id: id(), name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone || '',
      title: draft.title || 'Employee', department: draft.department || 'General', adminId: null,
      shift: draft.shift || '09:00 – 17:00', attendance: 'Not recorded', punchIn: '—', punchOut: '—',
      breakIn: '—', breakOut: '—', lunchOut: '—', lunchIn: '—', leaves: [], base: 15000, overtime: 0, ef: 0, esi: 0, pf: 0, paid: false,
    };
    setEmployees((current) => [...current, employee]);
    log(`Added employee ${employee.name} to the unassigned employee pool.`);
    setModal(null);
  };

  const saveTeamAssignment = () => {
    const selected = draft.employeeIds || [];
    const selectedByAnotherAdmin = selected.filter((employeeId) => admins.some((admin) => admin.id !== draft.id && admin.employeeIds.includes(employeeId)));
    if (selectedByAnotherAdmin.length) return notify('One or more selected employees are already assigned to another admin.');
    const admin = admins.find((item) => item.id === draft.id);
    if (!admin) return setModal(null);
    const released = admin.employeeIds.filter((employeeId) => !selected.includes(employeeId));
    setAdmins((current) => current.map((item) => item.id === admin.id ? { ...item, employeeIds: selected } : item));
    setEmployees((current) => current.map((employee) => {
      if (selected.includes(employee.id)) return { ...employee, adminId: admin.id };
      if (released.includes(employee.id)) return { ...employee, adminId: null };
      return employee;
    }));
    log(`Updated ${admin.name}'s team assignment.`);
    setModal(null);
  };

  const saveEmployeeReplacement = () => {
    if (!draft.outgoingId || !draft.incomingId) return notify('Select an employee to replace and a replacement employee.');
    if (draft.outgoingId === draft.incomingId) return notify('Choose two different employees.');
    const targetAdmin = admins.find((admin) => admin.id === draft.id);
    const incomingOwner = admins.find((admin) => admin.employeeIds.includes(draft.incomingId));
    if (!targetAdmin || !targetAdmin.employeeIds.includes(draft.outgoingId)) return setModal(null);
    if (!incomingOwner || incomingOwner.id === targetAdmin.id) return notify('Select an employee assigned to another admin.');

    const outgoing = employees.find((employee) => employee.id === draft.outgoingId);
    const incoming = employees.find((employee) => employee.id === draft.incomingId);
    if (!outgoing || !incoming) return setModal(null);

    setAdmins((current) => current.map((admin) => {
      if (admin.id === targetAdmin.id) {
        return { ...admin, employeeIds: admin.employeeIds.map((employeeId) => employeeId === draft.outgoingId ? draft.incomingId : employeeId) };
      }
      if (admin.id === incomingOwner.id) {
        return { ...admin, employeeIds: admin.employeeIds.map((employeeId) => employeeId === draft.incomingId ? draft.outgoingId : employeeId) };
      }
      return admin;
    }));
    setEmployees((current) => current.map((employee) => {
      if (employee.id === draft.outgoingId) return { ...employee, adminId: incomingOwner.id };
      if (employee.id === draft.incomingId) return { ...employee, adminId: targetAdmin.id };
      return employee;
    }));
    log(`Replaced ${outgoing.name} with ${incoming.name} in ${targetAdmin.name}'s team; ${outgoing.name} moved to ${incomingOwner.name}'s team.`);
    setModal(null);
  };

  const saveNewAdmin = () => {
    if (!isSuper) return notify('Only the Super Admin can create admin accounts.');
    const selected = draft.employeeIds || [];
    if (!draft.name || !draft.email || !draft.password?.trim()) return notify('Name, email, and a temporary password are required.');
    if (!isNonNegativeNumber(draft.salary)) return notify('Enter a valid non-negative monthly salary.');
    const normalizedEmail = draft.email.trim().toLowerCase();
    if (superAdmins.some((superAdmin) => superAdmin.email.toLowerCase() === normalizedEmail) || admins.some((admin) => admin.email.toLowerCase() === normalizedEmail)) return notify('That email is already in use.');
    const newId = id();
    const newAdmin = { id: newId, name: draft.name.trim(), email: draft.email.trim(), password: draft.password.trim(), phone: draft.phone || '', title: draft.title || 'Admin', salary: Number(draft.salary) || 0, paid: false, leaves: [], employeeIds: selected, accessModule: 'attendance' };
    setAdmins((current) => [...current, newAdmin]);
    setEmployees((current) => current.map((employee) => selected.includes(employee.id) ? { ...employee, adminId: newId } : employee));
    log(`Created admin account for ${newAdmin.name} and assigned ${selected.length} employee${selected.length === 1 ? '' : 's'}.`);
    setModal(null);
  };

  const savePayroll = () => {
    if (!isSuper) return notify('Payroll updates are restricted to the Super Admin.');
    const person = employees.find((employee) => employee.id === draft.id);
    if (!person) return setModal(null);
    if (![draft.base, draft.ef, draft.esi, draft.pf, draft.extraLeaves, draft.extraLeaveDeduction].every(isNonNegativeNumber)) return notify('Enter a valid non-negative number for each payroll field.');
    const newLoanAmount = draft.newLoanAmount || '';
    if (newLoanAmount !== '' && !isNonNegativeNumber(newLoanAmount)) return notify('Enter a valid non-negative loan amount.');
    if ((Number(newLoanAmount) > 0 || loanBalance(person) > 0) && !isPositiveInteger(draft.newLoanMonths)) return notify('Enter a valid positive whole number of repayment months for the employee loan.');
    if (!loanBalance(person) && Number(newLoanAmount) > 0 && person.paid && draft.paid) return notify('Record a new employee loan before marking this month’s salary paid.');
    const extra = Number(draft.extraLeaves);
    const deduction = extra === 0 ? 0 : Number(draft.extraLeaveDeduction);
    const next = {
      ...person,
      base: Number(draft.base),
      overtime: employeeOvertimeBonus(person),
      ef: Number(draft.ef),
      esi: Number(draft.esi),
      pf: Number(draft.pf),
      extraLeaveDeduction: deduction,
      leaves: (person.leaves || []).map((leave) => ({ ...leave })),
      paid: !!draft.paid,
    };
    if (!loanBalance(person) && Number(newLoanAmount) > 0) {
      next.loanPrincipal = Number(newLoanAmount);
      next.loanBalance = Number(newLoanAmount);
      next.loanTermMonths = Number(draft.newLoanMonths);
      next.loanMonthsPaid = 0;
      next.loanLastPaidMonth = null;
      next.loanLastDeduction = 0;
    } else if (loanBalance(person) > 0) {
      next.loanTermMonths = (Number(person.loanMonthsPaid) || 0) + Number(draft.newLoanMonths);
    }
    const existing = next.leaves.find((leave) => leave.type === 'Unpaid');
    if (existing) { existing.days = extra; existing.extraDays = extra; }
    else if (extra > 0 || employeeExtraLeaveDays(person) > 0) next.leaves.push({ type: 'Unpaid', days: extra, extraDays: extra });
    const paymentDetails = draft.paymentDetails || {};
    const paymentChanged = (draft.paymentMethod || '') !== (person.paymentMethod || '')
      || JSON.stringify(paymentDetails) !== JSON.stringify(person.paymentDetails || {});
    if (next.paid && (!person.paid || paymentChanged)) {
      const error = paymentValidationError(draft.paymentMethod, paymentDetails);
      if (error) return notify(error);
      next.paymentMethod = draft.paymentMethod;
      next.paymentDetails = { ...paymentDetails };
    }
    if (next.paid && !person.paid) {
      const installment = scheduledLoanDeduction(next);
      next.loanBalance = Math.max(0, loanBalance(next) - installment);
      next.loanMonthsPaid = Math.min(loanTermMonths(next), (Number(next.loanMonthsPaid) || 0) + (installment > 0 ? 1 : 0));
      next.loanLastPaidMonth = installment > 0 ? payrollMonth : null;
      next.loanLastDeduction = installment;
    } else if (!next.paid && person.paid && person.loanLastPaidMonth === payrollMonth) {
      next.loanBalance = Math.min(Number(person.loanPrincipal) || 0, loanBalance(person) + (Number(person.loanLastDeduction) || 0));
      next.loanMonthsPaid = Math.max(0, (Number(person.loanMonthsPaid) || 0) - 1);
      next.loanLastPaidMonth = null;
      next.loanLastDeduction = 0;
    }
    updateEmployee(person.id, next);
    log(`Updated ${payrollMonth} salary for ${person.name}; loan deduction ${money(loanDeduction(next, payrollMonth))}, payment ${next.paid ? 'paid' : 'pending'}, net ${money(netSalary(next, payrollMonth))}.`);
    setModal(null);
  };

  const openPayrollEditor = (employee) => {
    showModal('payroll', {
      ...employee,
      overtime: employeeOvertimeBonus(employee),
      extraLeaves: String(employeeExtraLeaveDays(employee)),
      extraLeaveDeduction: String(extraLeaveDeduction(employee)),
      newLoanAmount: '',
      newLoanMonths: loanBalance(employee)
        ? String(Math.max(1, loanTermMonths(employee) - (Number(employee.loanMonthsPaid) || 0)))
        : '',
      paymentMethod: employee.paymentMethod || (employee.paid ? '' : 'NEFT'),
      paymentDetails: { ...(employee.paymentDetails || {}) },
    });
  };

  const openAdminSalaryEditor = (admin) => {
    showModal('adminSalary', {
      ...admin,
      salaryText: String(admin.salary),
      efText: String(admin.ef || 0),
      esiText: String(admin.esi || 0),
      pfText: String(admin.pf || 0),
      extraLeaveText: String(adminExtraLeaveDays(admin)),
      extraLeaveDeductionText: String(adminExtraLeaveDeduction(admin)),
      newLoanAmount: '',
      newLoanMonths: loanBalance(admin)
        ? String(Math.max(1, loanTermMonths(admin) - (Number(admin.loanMonthsPaid) || 0)))
        : '',
      paymentMethod: admin.paymentMethod || (admin.paid ? '' : 'NEFT'),
      paymentDetails: { ...(admin.paymentDetails || {}) },
    });
  };

  const saveAdminSalary = () => {
    if (!isSuper) return notify('Only the Super Admin can update admin salaries.');
    const admin = admins.find((item) => item.id === draft.id);
    if (!admin) return setModal(null);
    if (![draft.salaryText, draft.efText, draft.esiText, draft.pfText, draft.extraLeaveText, draft.extraLeaveDeductionText].every(isNonNegativeNumber)) {
      return notify('Enter valid non-negative amounts for every admin payroll field.');
    }
    const newLoanAmount = draft.newLoanAmount || '';
    if (newLoanAmount !== '' && !isNonNegativeNumber(newLoanAmount)) return notify('Enter a valid non-negative loan amount.');
    if ((Number(newLoanAmount) > 0 || loanBalance(admin) > 0) && !isPositiveInteger(draft.newLoanMonths)) return notify('Enter a valid positive whole number of repayment months for the admin loan.');
    if (!loanBalance(admin) && Number(newLoanAmount) > 0 && admin.paid && draft.paid) {
      return notify('Record a new admin loan before marking this month’s salary paid.');
    }
    const paymentDetails = draft.paymentDetails || {};
    const paymentChanged = (draft.paymentMethod || '') !== (admin.paymentMethod || '')
      || JSON.stringify(paymentDetails) !== JSON.stringify(admin.paymentDetails || {});
    if (draft.paid && (!admin.paid || paymentChanged)) {
      const error = paymentValidationError(draft.paymentMethod, paymentDetails);
      if (error) return notify(error);
    }
    const extraLeaveDaysCount = Number(draft.extraLeaveText);
    const changes = {
      salary: Number(draft.salaryText),
      ef: Number(draft.efText),
      esi: Number(draft.esiText),
      pf: Number(draft.pfText),
      extraLeaveDeduction: calculateExtraLeaveDeduction(Number(draft.salaryText), extraLeaveDaysCount),
      paid: !!draft.paid,
    };
    if (!loanBalance(admin) && Number(newLoanAmount) > 0) {
      changes.loanPrincipal = Number(newLoanAmount);
      changes.loanBalance = Number(newLoanAmount);
      changes.loanTermMonths = Number(draft.newLoanMonths);
      changes.loanMonthsPaid = 0;
      changes.loanLastPaidMonth = null;
      changes.loanLastDeduction = 0;
    } else if (loanBalance(admin) > 0) {
      changes.loanTermMonths = (Number(admin.loanMonthsPaid) || 0) + Number(draft.newLoanMonths);
    }
    if (draft.paid && (!admin.paid || paymentChanged)) {
      changes.paymentMethod = draft.paymentMethod;
      changes.paymentDetails = { ...paymentDetails };
    }
    if (draft.paid && !admin.paid) {
      const installment = scheduledLoanDeduction({ ...admin, ...changes });
      changes.loanBalance = Math.max(0, loanBalance({ ...admin, ...changes }) - installment);
      changes.loanMonthsPaid = Math.min(loanTermMonths({ ...admin, ...changes }), (Number(changes.loanMonthsPaid ?? admin.loanMonthsPaid) || 0) + (installment > 0 ? 1 : 0));
      changes.loanLastPaidMonth = installment > 0 ? payrollMonth : null;
      changes.loanLastDeduction = installment;
    } else if (!draft.paid && admin.paid && admin.loanLastPaidMonth === payrollMonth) {
      changes.loanBalance = Math.min(Number(admin.loanPrincipal) || 0, loanBalance(admin) + (Number(admin.loanLastDeduction) || 0));
      changes.loanMonthsPaid = Math.max(0, (Number(admin.loanMonthsPaid) || 0) - 1);
      changes.loanLastPaidMonth = null;
      changes.loanLastDeduction = 0;
    }
    updateAdmin(admin.id, changes);
    log(`Updated ${payrollMonth} salary for admin ${admin.name}; payment ${draft.paid ? 'paid' : 'pending'}.`);
    setModal(null);
  };

  const exportSalaryReceipt = async (html, recipientName, recordType) => {
    try {
      if (Platform.OS === 'web') {
        const receiptFrame = document.createElement('iframe');
        receiptFrame.setAttribute('title', `${recipientName} salary receipt`);
        receiptFrame.setAttribute('aria-hidden', 'true');
        receiptFrame.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;border:0;z-index:2147483647;background:#fff;';
        document.body.appendChild(receiptFrame);
        const receiptWindow = receiptFrame.contentWindow;
        if (!receiptWindow) {
          receiptFrame.remove();
          throw new Error('Could not prepare the salary PDF for printing.');
        }
        receiptWindow.document.open();
        receiptWindow.document.write(html);
        receiptWindow.document.close();
        receiptWindow.onafterprint = () => receiptFrame.remove();
        setTimeout(() => {
          try {
            receiptWindow.focus();
            receiptWindow.print();
          } catch (error) {
            receiptFrame.remove();
            notify(`Could not open the print dialog: ${error.message}`);
          }
        }, 300);
      } else {
        const file = await Print.printToFileAsync({ html });
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', dialogTitle: `${recipientName} ${payrollMonth} salary receipt` });
        } else {
          notify(`PDF saved to ${file.uri}`);
        }
      }
      log(`Opened ${payrollMonth} ${recordType} PDF for ${recipientName}.`);
    } catch (error) {
      notify(`Could not export the salary PDF: ${error.message}`);
    }
  };

  const generatePayslip = async (employee) => {
    if (!isSuper && !(ownAdmin?.accessModule === 'payroll' && ownAdmin.employeeIds.includes(employee.id))) {
      return notify('You do not have payroll access to this employee.');
    }
    const leaveRows = [
      ['Recorded leave total (CL excluded)', `${countedLeaveDays(employee.leaves || [])} day(s)`],
      ['Casual Leave (CL)', `${(employee.leaves || []).filter((leave) => leave.type === 'Casual').reduce((sum, leave) => sum + Number(leave.days || 0), 0)} day(s) · excluded from extra-leave deduction`],
      ['Extra / unpaid leave for payroll', `${employeeExtraLeaveDays(employee)} day(s)`],
      ['Default extra-leave rate', `${money((Number(employee.base) || 0) / 30)} per day`],
    ];
    const principal = Number(employee.loanPrincipal) || 0;
    const loanRows = principal > 0 ? [
      ['Original loan principal', money(principal)],
      ['Agreed repayment term', `${loanTermMonths(employee)} month(s)`],
      ['Current-month installment', money(loanDeduction(employee, payrollMonth))],
      [`Outstanding loan balance ${employee.paid ? 'after' : 'before'} payout`, money(loanBalance(employee))],
      ['Estimated months remaining', `${loanMonthsRemaining(employee)} month(s)`],
    ] : [
      ['Loan status', 'No loan recorded'],
      ['Loan deduction', money(0)],
    ];
    const base = Number(employee.base) || 0;
    const overtime = employeeOvertimeBonus(employee);
    const totalDeductions = Number(employee.ef || 0) + Number(employee.esi || 0) + Number(employee.pf || 0)
      + extraLeaveDeduction(employee) + loanDeduction(employee, payrollMonth);
    const payout = netSalary(employee, payrollMonth);
    const paymentRows = paymentReceiptRows(employee);
    if (employee.paid) paymentRows.push(['Recorded payout amount', money(payout)]);
    const html = buildSalaryReceiptHtml({
      period: payrollMonth,
      recipientName: employee.name,
      recipientSubtitle: `${employee.title || 'Employee'} · ${employee.department || 'Department not recorded'} · ${employee.email || 'Email not recorded'}`,
      paid: employee.paid,
      netPay: money(payout),
      sections: [
        { title: 'Earnings', rows: [
          ['Base salary', money(base)],
          ['Overtime earnings', money(overtime)],
          ['Gross earnings', money(base + overtime)],
        ] },
        { title: 'Deductions', rows: [
          ['EF contribution', `−${money(employee.ef)}`],
          ['ESI contribution', `−${money(employee.esi)}`],
          ['PF contribution', `−${money(employee.pf)}`],
          [`Extra-leave deduction (${employeeExtraLeaveDays(employee)} day(s); CL excluded)`, `−${money(extraLeaveDeduction(employee))}`],
          ['Loan installment', `−${money(loanDeduction(employee, payrollMonth))}`],
          ['Total deductions', `−${money(totalDeductions)}`],
        ] },
        { title: 'Leave summary', rows: leaveRows },
        { title: 'Loan summary', rows: loanRows },
        { title: 'Payment record', rows: paymentRows },
      ],
      notes: [
        'Net payout = base salary + overtime earnings − EF − ESI − PF − extra-leave deduction − loan installment.',
        'Casual Leave (CL) is excluded from the extra-leave deduction. The default extra-leave rate is base salary ÷ 30 per day; the recorded payroll deduction is shown above.',
        'Time adjustment earnings are calculated at ₹5 per minute: positive for over-time and negative for under-time.',
        `Loan repayments are divided across the employee-selected ${loanTermMonths(employee)}-month term and capped to the outstanding balance.`,
        ...(totalDeductions > base + overtime ? ['Total deductions exceed gross earnings; the current payroll calculation limits net payout to ₹0.'] : []),
        ...(employee.paid ? [] : ['Payment is pending. This is a salary statement, not proof that payment was made.']),
        ...(Platform.OS === 'web' ? ['In the browser print dialog, choose “Save as PDF” to download this receipt.'] : []),
      ],
    });
    await exportSalaryReceipt(html, employee.name, 'employee salary');
  };

  const generateAdminPayslip = async (admin) => {
    if (!isSuper && ownAdmin?.id !== admin.id) return notify('You can only view your own admin salary receipt.');
    const casualDays = (admin.leaves || []).filter((leave) => leave.type === 'Casual')
      .reduce((sum, leave) => sum + Number(leave.days || 0), 0);
    const overtime = overtimeBonus(admin);
    const extraLeaveDaysCount = adminExtraLeaveDays(admin);
    const extraLeaveDeductionAmount = adminExtraLeaveDeduction(admin);
    const loanInstallment = loanDeduction(admin, payrollMonth);
    const principal = Number(admin.loanPrincipal) || 0;
    const balance = loanBalance(admin);
    const remainingMonths = loanMonthsRemaining(admin);
    const totalDeductions = (Number(admin.ef) || 0) + (Number(admin.esi) || 0) + (Number(admin.pf) || 0) + extraLeaveDeductionAmount + loanInstallment;
    const netPay = adminNetSalary(admin, payrollMonth);
    const paymentRows = paymentReceiptRows(admin);
    if (admin.paid) paymentRows.push(['Recorded payout amount', money(netPay)]);
    const html = buildSalaryReceiptHtml({
      period: payrollMonth,
      recipientName: admin.name,
      recipientSubtitle: `Admin · ${admin.title || 'Role not recorded'} · ${admin.email || 'Email not recorded'}`,
      paid: admin.paid,
      netPay: money(netPay),
      sections: [
        { title: 'Recorded salary', rows: [
          ['Monthly base salary', money(admin.salary)],
          ['Overtime earnings', overtime < 0 ? `−${money(Math.abs(overtime))}` : money(overtime)],
          ['Gross earnings', money((Number(admin.salary) || 0) + overtime)],
        ] },
        { title: 'Deductions', rows: [
          ['EF contribution', money(admin.ef)],
          ['ESI contribution', money(admin.esi)],
          ['PF contribution', money(admin.pf)],
          ['Extra-leave deduction', money(extraLeaveDeductionAmount)],
          ['Loan installment', money(loanInstallment)],
          ['Total deductions', money(totalDeductions)],
        ] },
        { title: 'Leave summary', rows: [
          ['Recorded leave total (CL excluded)', `${countedLeaveDays(admin.leaves || [])} day(s)`],
          ['Casual Leave (CL)', `${casualDays} day(s) · excluded from leave total`],
          ['Emergency leave', `${emergencyDays(admin.leaves || [])} day(s)`],
          ['Extra leave for payroll', `${extraLeaveDaysCount} day(s)`],
        ] },
        { title: 'Loan summary', rows: principal > 0 ? [
          ['Original loan principal', money(principal)],
          ['Agreed repayment term', `${loanTermMonths(admin)} month(s)`],
          ['Current-month installment', money(loanInstallment)],
          [`Outstanding loan balance ${admin.paid ? 'after' : 'before'} payout`, money(balance)],
          ['Estimated months remaining', `${remainingMonths} month(s)`],
        ] : [['Loan status', 'No loan recorded']] },
        { title: 'Payment record', rows: paymentRows },
      ],
      notes: [
        'Net payout = base salary + overtime adjustment − EF − ESI − PF − extra-leave deduction − loan installment.',
        'Overtime adjustment is ₹5 per minute of over-time and −₹5 per minute of under-time.',
        'Extra-leave deduction defaults to base salary ÷ 30 per extra leave day and can be edited by the Super Admin.',
        `Loan repayments are divided across the admin-selected ${loanTermMonths(admin)}-month term and capped to the outstanding balance.`,
        ...(admin.paid ? [] : ['Payment is pending. This is a salary statement, not proof that payment was made.']),
        ...(Platform.OS === 'web' ? ['In the browser print dialog, choose “Save as PDF” to download this receipt.'] : []),
      ],
    });
    await exportSalaryReceipt(html, admin.name, 'admin salary');
  };

  const generatePayrollReport = async () => {
    const rows = employees.map((employee) => `<tr><td>${escapeHtml(employee.name)}</td><td>${money(employee.base)}</td><td>${money(employeeOvertimeBonus(employee))}</td><td>${money(employee.ef)}</td><td>${money(employee.esi)}</td><td>${money(employee.pf)}</td><td>${employeeExtraLeaveDays(employee)}</td><td>${money(extraLeaveDeduction(employee))}</td><td>${money(Number(employee.loanPrincipal) || 0)}</td><td>${money(loanDeduction(employee, payrollMonth))}</td><td>${money(loanBalance(employee))}</td><td>${loanMonthsRemaining(employee)}</td><td>${money(netSalary(employee, payrollMonth))}</td><td>${employee.paid ? 'Paid' : 'Pending'}${employee.paymentMethod ? ` · ${escapeHtml(employee.paymentMethod)}` : ''}</td></tr>`).join('');
    const html = `<html><head><style>body{font-family:Arial,sans-serif;color:#16243A;padding:24px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{text-align:left;padding:9px;border-bottom:1px solid #E8EDF3}th{background:#F5F7FA}</style></head><body><h1>HRMS Organisation</h1><h2>${payrollMonth} payroll report</h2><p>Employee salary components and calculated net pay</p><table><thead><tr><th>Employee</th><th>Base</th><th>OT</th><th>EF</th><th>ESI</th><th>PF</th><th>Extra leave</th><th>Extra leave deduction</th><th>Loan</th><th>Loan deduction</th><th>Loan balance</th><th>Months left</th><th>Net</th><th>Status / method</th></tr></thead><tbody>${rows}</tbody></table><p>Extra leave deduction defaults to base salary ÷ 30 per day.</p></body></html>`;
    try {
      if (Platform.OS === 'web') await Print.printAsync({ html });
      else {
        const file = await Print.printToFileAsync({ html });
        if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', dialogTitle: `${payrollMonth} payroll report` });
        else notify(`Payroll report saved to ${file.uri}`);
      }
      log(`Generated the ${payrollMonth} payroll report.`);
    } catch (error) {
      notify(`Could not generate the payroll report: ${error.message}`);
    }
  };

  if (!user) {
    return (
      <View style={styles.loginPage}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.loginPageScroll} contentContainerStyle={styles.loginPageContent} keyboardShouldPersistTaps="handled">
          <View style={[styles.loginShell, wide && styles.loginShellWide]}>
            <View style={[styles.loginShowcase, wide && styles.loginShowcaseWide]}>
              <View style={styles.loginShowcaseOrbLarge} />
              <View style={styles.loginShowcaseOrbSmall} />
            <View style={styles.loginBrandRow}>
              <View style={styles.loginBrandMark}><Text style={styles.loginBrandMarkText}>H</Text></View>
              <View><Text style={styles.loginBrandTitle}>HRMS</Text><Text style={styles.loginBrandSub}>PEOPLE OPERATIONS</Text></View>
            </View>
            {wide ? <View style={styles.loginShowcaseCopyBlock}>
              <Text style={styles.loginShowcaseEyebrow}>PEOPLE-FIRST OPERATIONS</Text>
              <Text style={styles.loginShowcaseTitle}>Your people. Your workplace. In sync.</Text>
              <Text style={styles.loginShowcaseCopy}>A clear, connected workspace for attendance, employee records, and payroll.</Text>
            </View> : <View style={styles.loginShowcaseCopyBlock}>
              <Text style={styles.loginShowcaseTitleCompact}>People operations, made simpler.</Text>
              <Text style={styles.loginShowcaseCopy}>Secure access to your organisation workspace.</Text>
            </View>}
            {wide && <View style={styles.loginShowcaseFoot}><View style={styles.loginShowcaseDot} /><Text style={styles.loginShowcaseFootText}>Secure, role-based access</Text></View>}
            </View>
            <View style={[styles.loginCard, wide && styles.loginCardWide]}>
              <Text style={styles.loginEyebrow}>SECURE WORKSPACE ACCESS</Text>
              <Text style={styles.loginTitle}>Sign in to HRMS</Text>
              <Text style={styles.loginLead}>Use the credentials provided by your organisation.</Text>
              <Field label="Work email" value={email} onChangeText={setEmail} placeholder="you@company.com" keyboardType="email-address" />
              <Field label="Password" value={password} onChangeText={setPassword} placeholder="Enter your password" secureTextEntry />
              {!!loginError && <Text style={styles.loginError}>{loginError}</Text>}
              <Button title="Sign in" onPress={signIn} />
              <Text style={styles.loginSecurity}>Access is limited to Super Admin and authorised Admin accounts. Employee sign-in is disabled.</Text>
              <Text style={styles.prototypeNote}>Prototype only: records are saved in this browser and are not shared across devices or secured for production use.</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const superTabs = ['Overview', 'Admins', 'Admin payroll', 'Employees', 'Payroll'];
  const adminTabs = ['Overview', hasPayrollAccess ? 'Team payroll' : 'My team', 'My profile'];
  const tabs = isSuper ? superTabs : adminTabs;
  const attendanceDateLabel = new Date(`${attendanceDate}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const renderOverview = () => (
    <>
      <SectionTitle title={`Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${user.name.split(' ')[0]}`} subtitle={isSuper ? 'Here is what is happening across your organisation.' : 'Your team and priorities at a glance.'} />
      <View style={styles.metrics}>
        {hasPayrollAccess ? <>
          <Metric label="ASSIGNED TEAM" value={visibleEmployees.length} detail="payroll access only" />
          <Metric label="PAYMENTS PENDING" value={visibleEmployees.filter((employee) => !employee.paid).length} detail={payrollMonth} tone="amber" />
          <Metric label="TEAM NET PAYROLL" value={money(visibleEmployees.reduce((sum, employee) => sum + netSalary(employee, payrollMonth), 0))} detail="assigned employees" tone="blue" />
        </> : <>
          <Metric label={isSuper ? 'TOTAL EMPLOYEES' : 'YOUR TEAM'} value={isSuper ? employees.length : visibleEmployees.length} detail={isSuper ? `${admins.length} admin teams` : '4 assigned employees'} />
          <Metric label="PRESENT TODAY" value={visibleEmployees.filter((employee) => employee.attendance === 'Present').length} detail={`${visibleEmployees.filter((employee) => employee.attendance !== 'Present').length} need attention`} tone="green" />
          {isSuper && <Metric label="PAYROLL · NOV" value={employees.filter((employee) => !employee.paid).length} detail="employee payments pending" tone="blue" />}
        </>}
      </View>
      <View style={styles.dashboardColumns}>
        <View style={[styles.panel, styles.growPanel]}>
          <SectionTitle title={hasPayrollAccess ? 'Assigned team payroll' : isSuper ? 'Attendance snapshot' : 'My team attendance'} subtitle={hasPayrollAccess ? 'Payroll status for your assigned employees' : `Daily attendance status · ${attendanceDateLabel}`} />
          <View style={styles.dataTable}>
            {hasPayrollAccess ? <>
              <View style={styles.tableHeader}><Text style={[styles.th, { flex: 2 }]}>EMPLOYEE</Text><Text style={styles.th}>NET PAY</Text><Text style={styles.th}>PAYMENT</Text></View>
              {visibleEmployees.slice(0, 5).map((employee) => <View key={employee.id} style={styles.tableRow}><Text style={[styles.tdStrong, { flex: 2 }]}>{employee.name}</Text><Text style={styles.tdStrong}>{money(netSalary(employee, payrollMonth))}</Text><View style={styles.tableCell}><Badge tone={employee.paid ? 'green' : 'amber'}>{employee.paid ? 'Paid' : 'Pending'}</Badge></View></View>)}
            </> : <>
              <View style={styles.tableHeader}><Text style={[styles.th, { flex: 2 }]}>EMPLOYEE</Text><Text style={styles.th}>STATUS</Text><Text style={styles.th}>PUNCH IN</Text></View>
              {visibleEmployees.slice(0, 5).map((employee) => <View key={employee.id} style={styles.tableRow}><Text style={[styles.tdStrong, { flex: 2 }]}>{employee.name}</Text><View style={styles.tableCell}><Badge tone={attendanceTone(employee.attendance)}>{employee.attendance}</Badge></View><Text style={styles.td}>{employee.punchIn}</Text></View>)}
            </>}
          </View>
          <Button title={hasPayrollAccess ? 'View team payroll' : 'View team attendance'} variant="soft" small onPress={() => setTab(isSuper ? 'Employees' : hasPayrollAccess ? 'Team payroll' : 'My team')} />
        </View>
      </View>
      {isSuper && <View style={styles.notice}><Text style={styles.noticeTitle}>Admin oversight</Text><Text style={styles.noticeText}>Admins manage only their assigned employees. Their employee updates are visible to you across this workspace.</Text></View>}
    </>
  );

  const renderAdmins = () => (
    <>
      <SectionTitle title="Admin accounts" subtitle="Create controlled admin access and manage employee assignments." action={<View style={styles.rowActions}><Button title="+ Add employee" variant="outline" small onPress={() => showModal('newEmployee', {})} /><Button title="+ Add admin" small onPress={() => showModal('newAdmin', { employeeIds: [], salary: '20000', accessModule: 'attendance' })} /></View>} />
      {isSuper && <View style={styles.panel}>
        <SectionTitle title="Super Admin account" subtitle="Organisation-wide access." />
        {superAdmins.map((superAdmin) => <View key={superAdmin.id} style={styles.adminSalaryRow}>
          <View style={{ flex: 1 }}><Text style={styles.tdStrong}>{superAdmin.name}</Text><Text style={styles.tdSmall}>{superAdmin.email}</Text></View>
          <Badge tone="blue">Super Admin</Badge>
        </View>)}
      </View>}
      {isSuper && <View style={styles.panel}>
        <SectionTitle title="Admin login credentials" subtitle="Visible only to the Super Admin. Share each admin's credentials directly with them." />
        {admins.map((admin) => <View key={`credentials-${admin.id}`} style={styles.auditLine}>
          <View style={{ flex: 1 }}>
            <Text style={styles.auditMessage}>{admin.name}</Text>
            <Text style={styles.auditMeta}>Email: {admin.email}</Text>
            <Text style={styles.auditMeta}>Password: {admin.password}</Text>
          </View>
        </View>)}
      </View>}
      <View style={styles.metrics}>
        <Metric label="ACTIVE ADMINS" value={admins.length} detail="Super Admin managed" />
        <Metric label="TEAM ASSIGNMENTS" value={admins.reduce((sum, admin) => sum + admin.employeeIds.length, 0)} detail="employees assigned to admins" tone="green" />
        <Metric label="ADMIN PAYMENTS PENDING" value={admins.filter((admin) => !admin.paid).length} detail="November 2026" tone="amber" />
      </View>
      {isSuper && <View style={styles.panel}>
        <SectionTitle title="Admin attendance" subtitle={`Super Admin-only admin attendance and shift records · ${attendanceDateLabel}.`} action={<Button title="Sync biometric" variant="outline" small onPress={() => showModal('biometricSync', { endpoint: biometricEndpoint, token: biometricToken })} />} />
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ minWidth: 2500 }}>
            <View style={styles.dataTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 1.4 }]}>ADMIN</Text>
                <Text style={[styles.th, { flex: 1.1 }]}>STATUS</Text>
                <Text style={styles.th}>PUNCH IN</Text>
                <Text style={styles.th}>PUNCH OUT</Text>
                <Text style={styles.th}>BREAK OUT</Text>
                <Text style={styles.th}>BREAK IN</Text>
                <Text style={[styles.th, { flex: 1.7 }]}>LUNCH BREAK</Text>
                <Text style={styles.th}>TAKEN DURATION</Text>
                <Text style={[styles.th, { flex: 1.2 }]}>SHIFT</Text>
                <Text style={[styles.th, { flex: 1.1 }]}>OVER TIMING</Text>
                <Text style={styles.th}>LEAVES*</Text>
                <Text style={[styles.th, { flex: 4 }]}>ACTIONS</Text>
              </View>
              {admins.map((admin) => <View key={`attendance-${admin.id}`} style={styles.tableRow}>
                <View style={{ flex: 1.4 }}><Text style={styles.tdStrong}>{admin.name}</Text><Text style={styles.tdSmall}>{admin.title}</Text></View>
                <View style={[styles.tableCell, { flex: 1.1 }]}><Badge tone={attendanceTone(admin.attendance || 'Not recorded')}>{admin.attendance || 'Not recorded'}</Badge></View>
                <Text style={styles.td}>{admin.punchIn || '—'}</Text>
                <Text style={styles.td}>{admin.punchOut || '—'}</Text>
                <Text style={styles.td}>{admin.breakOut || '—'}</Text>
                <Text style={styles.td}>{admin.breakIn || '—'}</Text>
                <View style={{ flex: 1.7 }}><Text style={styles.tdSmall}>Out {admin.lunchOut || '—'} · In {admin.lunchIn || '—'}</Text></View>
                <Text style={styles.td}>{formatDuration(lunchBreakMinutes(admin))}</Text>
                <Text style={[styles.td, { flex: 1.2 }]}>{admin.shift || '—'}</Text>
                <Text style={[styles.td, { flex: 1.1 }]}>{overTiming(admin) || '—'}</Text>
                <Text style={styles.td}>{countedLeaveDays(admin.leaves)}</Text>
                <View style={[styles.tableCell, { flex: 4, flexWrap: 'nowrap', gap: 4 }]}>
                  <Button title="Edit" variant="soft" small onPress={() => showModal('adminAttendance', { ...admin, leaveType: 'None', leaveDays: '0' })} />
                  <Button title="Month" variant="outline" small onPress={() => {
                    setSelectedAdminHistoryId(admin.id);
                    setSelectedAttendanceDate(attendanceDate);
                    setAttendanceCalendarMonth(new Date(`${attendanceDate}T00:00:00`));
                    setModal('adminAttendanceHistory');
                  }} />
                  {['Present', 'Late'].includes(admin.attendance) && <Button title="Lunch out" variant="outline" small onPress={() => recordAdminLunchPunch(admin.id, 'out')} />}
                  {['Present', 'Late'].includes(admin.attendance) && <Button title="Lunch in" variant="outline" small onPress={() => recordAdminLunchPunch(admin.id, 'in')} />}
                </View>
              </View>)}
            </View>
          </View>
        </ScrollView>
        <Text style={styles.caption}>* CL (Casual Leave) is excluded from the leave total.</Text>
      </View>}
      <View style={styles.adminGrid}>
        {admins.map((admin) => {
          const team = employees.filter((employee) => admin.employeeIds.includes(employee.id));
          return <View style={[styles.panel, styles.adminCard]} key={admin.id}>
            <View style={styles.adminCardHead}><View style={styles.avatar}><Text style={styles.avatarText}>{admin.name.split(' ').map((part) => part[0]).join('')}</Text></View><View style={{ flex: 1 }}><Text style={styles.cardTitle}>{admin.name}</Text><Text style={styles.cardSub}>{admin.title} · {admin.accessModule === 'payroll' ? 'Payroll access' : 'Attendance access'}</Text></View><View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}><Badge tone="blue">{team.length} employees</Badge>{isSuper && <Button title="Delete" variant="danger" small onPress={() => deleteAdminAccount(admin)} />}</View></View>
            <Text style={styles.contactText}>{admin.email}</Text><Text style={styles.contactText}>{admin.phone || 'Phone not provided'}</Text>
            <View style={styles.detailStrip}><Text style={styles.detailLabel}>Salary · {money(admin.salary)}</Text><Badge tone={admin.paid ? 'green' : 'amber'}>{admin.paid ? 'Paid' : 'Pending'}</Badge></View>
            <Text style={styles.teamLabel}>ASSIGNED EMPLOYEES</Text>
            <Text style={styles.teamNames}>{team.map((employee) => employee.name).join('  ·  ') || 'No employees assigned'}</Text>
            <View style={styles.rowActions}>
              <Button title="Edit admin" variant="soft" small onPress={() => showModal('editAdmin', { ...admin })} />
              <Button title="Manage team" variant="outline" small onPress={() => showModal('team', { id: admin.id, employeeIds: [...admin.employeeIds] })} />
              <Button title="Replace employee" variant="outline" small onPress={() => showModal('replaceEmployee', { id: admin.id, outgoingId: null, incomingId: null })} />
              <Button title="Admin salary" variant="outline" small onPress={() => openAdminSalaryEditor(admin)} />
            </View>
          </View>;
        })}
      </View>
      <View style={styles.panel}><SectionTitle title="Admin account access" subtitle="Admins sign in only with credentials created and distributed by the Super Admin." /><Text style={styles.bodyText}>There is no admin self-registration, employee login, or employee-facing application access in this model. Change an admin's email/password by editing the account.</Text></View>
    </>
  );

  const openEmployee = (employee) => {
    setSelectedEmployee(employee);
    showModal('employeeDetail', { ...employee });
  };

  const changeAttendanceCalendarMonth = (offset) => {
    const nextMonth = new Date(attendanceCalendarMonth.getFullYear(), attendanceCalendarMonth.getMonth() + offset, 1);
    setAttendanceCalendarMonth(nextMonth);
    setSelectedAttendanceDate(localDateKey(nextMonth));
  };

  const addPublicEvent = () => {
    if (!isSuper) return notify('Only the Super Admin can manage public events.');
    const name = publicEventName.trim();
    const date = publicEventDate.trim();
    const parts = /^\d{4}-\d{2}-\d{2}$/.test(date) ? date.split('-').map(Number) : [];
    const parsedDate = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : null;
    if (!name) return notify('Enter a public event name.');
    if (!parsedDate || localDateKey(parsedDate) !== date) return notify('Enter a valid public event date in YYYY-MM-DD format.');
    if (publicEvents.some((event) => event.date === date && event.name.toLowerCase() === name.toLowerCase())) {
      return notify('That public event is already recorded for this date.');
    }

    const event = { id: id(), date, name };
    setPublicEvents((current) => [...current, event].sort((first, second) => first.date.localeCompare(second.date)));
    log(`Added public event "${name}" on ${date}.`);
    setPublicEventName('');
  };

  const removePublicEvent = (event) => {
    if (!isSuper) return notify('Only the Super Admin can manage public events.');
    const confirmation = `Remove "${event.name}" from ${event.date}?`;
    const remove = () => {
      setPublicEvents((current) => current.filter((item) => item.id !== event.id));
      log(`Removed public event "${event.name}" on ${event.date}.`);
    };
    if (Platform.OS === 'web') {
      if (typeof window === 'undefined' || !window.confirm(confirmation)) return;
      remove();
      return;
    }
    Alert.alert('Remove public event?', confirmation, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: remove },
    ]);
  };

  const renderAdminAttendanceHistory = (admin) => {
    const year = attendanceCalendarMonth.getFullYear();
    const month = attendanceCalendarMonth.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const weeks = calendarWeeks(attendanceCalendarMonth);
    const history = Array.isArray(admin.attendanceHistory) ? admin.attendanceHistory : [];
    const recordForDate = (date) => history.find((record) => record.date === date) || null;
    const selectedRecord = recordForDate(selectedAttendanceDate);
    const selectedDate = new Date(`${selectedAttendanceDate}T00:00:00`);

    return <>
      <View style={styles.detailBlock}>
        <Text style={styles.detailLabel}>MONTHLY ADMIN ATTENDANCE HISTORY</Text>
        <Text style={styles.bodyText}>Daily admin attendance records are saved by date and retained when the workspace advances to a new day.</Text>
        <View style={styles.calendarHeader}>
          <Button title="Previous" variant="outline" small onPress={() => changeAttendanceCalendarMonth(-1)} />
          <Text style={styles.calendarMonth}>{attendanceCalendarMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</Text>
          <Button title="Next" variant="outline" small onPress={() => changeAttendanceCalendarMonth(1)} />
        </View>
        <View style={styles.calendarWeek}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <Text key={day} style={styles.calendarWeekday}>{day}</Text>)}
        </View>
        {weeks.map((week, weekIndex) => <View key={`admin-week-${weekIndex}`} style={styles.calendarWeek}>
          {week.map((day, dayIndex) => {
            if (!day) return <View key={`admin-blank-${weekIndex}-${dayIndex}`} style={[styles.calendarDay, styles.calendarBlank]} />;
            const date = `${monthKey}-${String(day).padStart(2, '0')}`;
            const isSunday = new Date(year, month, day).getDay() === 0;
            const dayEvents = publicEvents.filter((event) => event.date === date);
            const dayRecord = recordForDate(date);
            return <Pressable key={date} onPress={() => setSelectedAttendanceDate(date)} style={[styles.calendarDay, isSunday && styles.calendarHoliday, dayEvents.length > 0 && styles.calendarPublicEvent, date === selectedAttendanceDate && styles.calendarSelected]}>
              <Text style={styles.calendarDayNumber}>{day}</Text>
              {isSunday && <Text style={styles.calendarHolidayText}>Sunday holiday</Text>}
              {dayEvents.map((event) => <Text key={event.id} numberOfLines={1} style={styles.calendarEventText}>Holiday · {event.name}</Text>)}
              {dayRecord && <Text numberOfLines={1} style={styles.calendarStatusText}>{dayRecord.attendance}</Text>}
              {!dayRecord && !isSunday && !dayEvents.length && <Text style={styles.calendarNoRecord}>No record</Text>}
              {!dayRecord && (isSunday || dayEvents.length > 0) && <Text style={styles.calendarNoRecord}>No attendance</Text>}
            </Pressable>;
          })}
        </View>)}
        <View style={styles.calendarLegend}>
          <Text style={styles.calendarLegendText}>Sunday = holiday</Text>
          <Text style={styles.calendarLegendText}>Purple = public event</Text>
          <Text style={styles.calendarLegendText}>Select a date to view its record</Text>
        </View>
      </View>
      <View style={styles.detailBlock}>
        <Text style={styles.detailLabel}>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        {selectedDate.getDay() === 0 && <Text style={styles.bodyText}>Holiday · Sunday</Text>}
        {publicEvents.filter((event) => event.date === selectedAttendanceDate).map((event) => <Text key={event.id} style={styles.bodyText}>Public holiday / event · {event.name}</Text>)}
        {selectedRecord ? <>
          <Text style={styles.detailValue}>Attendance · {selectedRecord.attendance}</Text>
          <Text style={styles.bodyText}>Punch in {selectedRecord.punchIn || '—'} · Punch out {selectedRecord.punchOut || '—'}</Text>
          <Text style={styles.bodyText}>Break {selectedRecord.breakIn || '—'} – {selectedRecord.breakOut || '—'} · Lunch out {selectedRecord.lunchOut || '—'} · Lunch in {selectedRecord.lunchIn || '—'}</Text>
          {selectedRecord.updatedBy && <Text style={styles.bodyText}>Updated by · {selectedRecord.updatedBy}</Text>}
        </> : <Text style={styles.bodyText}>No daily admin attendance record is stored for this date.</Text>}
      </View>
    </>;
  };

  const renderAttendanceCalendar = (employee) => {
    const today = attendanceDate;
    const year = attendanceCalendarMonth.getFullYear();
    const month = attendanceCalendarMonth.getMonth();
    const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`;
    const history = Array.isArray(employee.attendanceHistory) ? employee.attendanceHistory : [];
    const assignedAdmin = admins.find((admin) => admin.id === employee.adminId);
    const currentRecord = {
      attendance: employee.attendance,
      punchIn: employee.punchIn,
      punchOut: employee.punchOut,
      breakIn: employee.breakIn,
      breakOut: employee.breakOut,
      extraLeaveDays: employeeExtraLeaveDays(employee),
      legacy: true,
    };
    const eventsForDate = (date) => publicEvents.filter((event) => event.date === date);
    const recordForDate = (date) => {
      const savedRecord = history.find((record) => record.date === date && !record.demo);
      if (savedRecord) return savedRecord;
      if (date === today) return employee.attendance === 'Not recorded' ? null : currentRecord;
      return history.find((record) => record.date === date) || null;
    };
    const weeks = calendarWeeks(attendanceCalendarMonth);
    const monthEvents = publicEvents.filter((event) => event.date.startsWith(monthKey));
    const selectedRecord = recordForDate(selectedAttendanceDate);
    const selectedEvents = eventsForDate(selectedAttendanceDate);
    const selectedLateMinutes = selectedRecord ? lateMinutesForRecord(selectedRecord, employee) : null;
    const selectedDate = new Date(`${selectedAttendanceDate}T00:00:00`);

    return <>
      <View style={styles.detailBlock}>
        <Text style={styles.detailLabel}>MONTHLY ATTENDANCE HISTORY</Text>
        <Text style={styles.bodyText}>Seeded employees include a complete November 2026 demo month. Daily records saved by assigned admins are date-stamped; weekdays without records show no record, and Sundays are holidays.</Text>
        <View style={styles.calendarHeader}>
          <Button title="Previous" variant="outline" small onPress={() => changeAttendanceCalendarMonth(-1)} />
          <Text style={styles.calendarMonth}>{attendanceCalendarMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</Text>
          <Button title="Next" variant="outline" small onPress={() => changeAttendanceCalendarMonth(1)} />
        </View>
        <View style={styles.calendarWeek}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <Text key={day} style={styles.calendarWeekday}>{day}</Text>)}
        </View>
        {weeks.map((week, weekIndex) => <View key={`week-${weekIndex}`} style={styles.calendarWeek}>
          {week.map((day, dayIndex) => {
            if (!day) return <View key={`blank-${weekIndex}-${dayIndex}`} style={[styles.calendarDay, styles.calendarBlank]} />;
            const date = `${monthKey}-${String(day).padStart(2, '0')}`;
            const isSunday = new Date(year, month, day).getDay() === 0;
            const dayEvents = eventsForDate(date);
            const dayRecord = recordForDate(date);
            const displayedAttendance = dayRecord?.attendance === 'Late' || dayRecord?.attendance === 'Present'
              ? 'Present'
              : dayRecord?.attendance === 'Absent' ? 'Absent' : null;
            const selected = date === selectedAttendanceDate;
            return <Pressable key={date} onPress={() => setSelectedAttendanceDate(date)} style={[styles.calendarDay, isSunday && styles.calendarHoliday, dayEvents.length > 0 && styles.calendarPublicEvent, selected && styles.calendarSelected]}>
              <Text style={styles.calendarDayNumber}>{day}</Text>
              {isSunday && <Text style={styles.calendarHolidayText}>Sunday holiday</Text>}
              {dayEvents.map((event) => <Text key={event.id} numberOfLines={1} style={styles.calendarEventText}>Holiday · {event.name}</Text>)}
              {displayedAttendance && <Text numberOfLines={1} style={styles.calendarStatusText}>{displayedAttendance}</Text>}
              {dayRecord?.leaveType && Number(dayRecord.leaveDays) > 0 && <Text numberOfLines={1} style={styles.calendarLeaveText}>{dayRecord.leaveType} leave</Text>}
              {Number(dayRecord?.extraLeaveDays) > 0 && <Text numberOfLines={1} style={styles.calendarLeaveText}>Extra leave · {dayRecord.extraLeaveDays}d</Text>}
              {!dayRecord && !isSunday && !dayEvents.length && <Text style={styles.calendarNoRecord}>No record</Text>}
              {!dayRecord && (isSunday || dayEvents.length > 0) && <Text style={styles.calendarNoRecord}>No attendance</Text>}
            </Pressable>;
          })}
        </View>)}
        <View style={styles.calendarLegend}>
          <Text style={styles.calendarLegendText}>Sunday = holiday</Text>
          <Text style={styles.calendarLegendText}>Purple = public event</Text>
          <Text style={styles.calendarLegendText}>Select a date to view its record</Text>
        </View>
      </View>
      <View style={styles.detailBlock}>
        <Text style={styles.detailLabel}>{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</Text>
        {selectedDate.getDay() === 0 && <Text style={styles.bodyText}>Holiday · Sunday</Text>}
        {selectedEvents.map((event) => <Text key={event.id} style={styles.bodyText}>Public holiday / event · {event.name}</Text>)}
        {selectedRecord ? <>
          <Text style={styles.detailValue}>Attendance · {selectedRecord.attendance}</Text>
          <Text style={styles.bodyText}>Punch in {selectedRecord.punchIn || '—'} · Punch out {selectedRecord.punchOut || '—'}</Text>
          <Text style={styles.bodyText}>Break {selectedRecord.breakIn || '—'} – {selectedRecord.breakOut || '—'}</Text>
          <Text style={styles.bodyText}>Lunch out {selectedRecord.lunchOut || '—'} · Lunch in {selectedRecord.lunchIn || '—'}</Text>
          <Text style={styles.bodyText}>Shift {selectedRecord.shift || employee.shift} · Net punch adjustment {formatOvertimeMinutes(overtimeMinutesForRecord(selectedRecord, employee))}</Text>
          {selectedLateMinutes > 0 && <Text style={styles.bodyText}>Late punch-in · -{formatDuration(selectedLateMinutes)} · Deduction −{money(selectedLateMinutes * 5)} (₹5/min, included in the net adjustment)</Text>}
          {selectedRecord.leaveType && Number(selectedRecord.leaveDays) > 0 && <Text style={styles.bodyText}>Leave record updated · {selectedRecord.leaveType} · {selectedRecord.leaveDays} day(s)</Text>}
          {Number(selectedRecord.extraLeaveDays) > 0 && <Text style={styles.bodyText}>{selectedRecord.legacy ? 'Current extra leave total' : 'Extra leave total recorded'} · {selectedRecord.extraLeaveDays} day(s)</Text>}
          {selectedRecord.updatedBy && <Text style={styles.bodyText}>{selectedRecord.demo ? 'Demo record uploaded by allocated admin' : 'Updated by allocated admin'} · {selectedRecord.updatedBy}</Text>}
          {selectedRecord.legacy && <Text style={styles.caption}>This date uses the app’s current attendance fields. Date-stamped history starts when an admin saves a daily record.</Text>}
        </> : <Text style={styles.bodyText}>No daily attendance record is stored for this date.</Text>}
      </View>
      {isSuper && <View style={styles.detailBlock}>
        <Text style={styles.detailLabel}>MANAGE PUBLIC EVENTS / HOLIDAYS</Text>
        <Field label="Event name" value={publicEventName} onChangeText={setPublicEventName} placeholder="For example, public holiday" />
        <Field label="Event date · YYYY-MM-DD" value={publicEventDate} onChangeText={setPublicEventDate} placeholder="YYYY-MM-DD" />
        <Button title="Add public event" variant="soft" onPress={addPublicEvent} />
        {monthEvents.map((event) => <View key={event.id} style={styles.publicEventRow}>
          <Text style={styles.bodyText}>{event.date} · {event.name}</Text>
          <Button title="Remove" variant="danger" small onPress={() => removePublicEvent(event)} />
        </View>)}
      </View>}
    </>;
  };

  const renderEmployees = () => (
    <>
      <SectionTitle title={isSuper ? 'Employee directory' : 'My team'} subtitle={`${isSuper ? 'Organisation-wide visibility for the Super Admin.' : 'Employees assigned to your admin account.'} Attendance for ${attendanceDateLabel}.`} action={<Button title="Sync biometric" variant="outline" small onPress={() => showModal('biometricSync', { endpoint: biometricEndpoint, token: biometricToken })} />} />
      {isSuper && <TextInput value={filter} onChangeText={setFilter} placeholder="Search employees by name, email or department" placeholderTextColor="#A0AABC" style={styles.searchInput} />}
      <View style={styles.metrics}>
        <Metric label="ASSIGNED TEAM" value={visibleEmployees.length} detail={isSuper ? 'across all admin groups' : 'assigned employees'} />
        <Metric label="PRESENT" value={visibleEmployees.filter((employee) => employee.attendance === 'Present').length} detail={attendanceDateLabel} tone="green" />
        <Metric label="LEAVES · CL EXCLUDED" value={visibleEmployees.reduce((sum, employee) => sum + countedLeaveDays(employee.leaves), 0)} detail={`${visibleEmployees.reduce((sum, employee) => sum + emergencyDays(employee.leaves), 0)} emergency days`} tone="amber" />
      </View>
      <View style={styles.panel}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ minWidth: 1780 }}>
            <View style={styles.dataTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 1.6 }]}>EMPLOYEE</Text>
                <Text style={[styles.th, { flex: 1.1 }]}>STATUS</Text>
                <Text style={styles.th}>PUNCH IN</Text>
                <Text style={styles.th}>PUNCH OUT</Text>
                <Text style={styles.th}>BREAK IN</Text>
                <Text style={styles.th}>BREAK OUT</Text>
                <Text style={[styles.th, { flex: 1.7 }]}>LUNCH BREAK</Text>
                <Text style={styles.th}>TAKEN DURATION</Text>
                <Text style={[styles.th, { flex: 1.2 }]}>SHIFT</Text>
                <Text style={[styles.th, { flex: 1.1 }]}>OVER TIMING</Text>
                <Text style={styles.th}>LEAVES*</Text>
                <Text style={[styles.th, { flex: 1.1 }]}>ADMIN</Text>
                <Text style={[styles.th, { flex: 4.5 }]}>ACTIONS</Text>
              </View>
              {filteredEmployees.map((employee) => {
                const assignedAdmin = admins.find((admin) => admin.id === employee.adminId);
                return <View key={employee.id} style={styles.tableRow}>
                  <View style={{ flex: 1.6 }}><Text style={styles.tdStrong}>{employee.name}</Text><Text style={styles.tdSmall}>{employee.title} · {employee.department}</Text></View>
                  <View style={[styles.tableCell, { flex: 1.1 }]}><Badge tone={attendanceTone(employee.attendance)}>{employee.attendance}</Badge></View>
                  <Text style={styles.td}>{employee.punchIn}</Text>
                  <Text style={styles.td}>{employee.punchOut}</Text>
                  <Text style={styles.td}>{employee.breakIn}</Text>
                  <Text style={styles.td}>{employee.breakOut}</Text>
                  <View style={{ flex: 1.7 }}>
                    <Text style={styles.tdSmall}>Out {employee.lunchOut && employee.lunchOut !== '—' ? employee.lunchOut : '—'} · In {employee.lunchIn && employee.lunchIn !== '—' ? employee.lunchIn : '—'}</Text>
                  </View>
                  <Text style={styles.td}>{formatDuration(lunchBreakMinutes(employee))}</Text>
                  <Text style={[styles.td, { flex: 1.2 }]}>{employee.shift}</Text>
                  <Text style={[styles.td, { flex: 1.1 }]}>{overTiming(employee) || '—'}</Text>
                  <Text style={styles.td}>{countedLeaveDays(employee.leaves)}</Text>
                  <Text style={[styles.td, { flex: 1.1 }]}>{assignedAdmin?.name || 'Unassigned'}</Text>
                  <View style={[styles.tableCell, { flex: 4.5, flexWrap: 'nowrap', gap: 4 }]}>
                    <Button title="Details" variant="soft" small onPress={() => openEmployee(employee)} />
                    {!isSuper && <>
                      <Button title="Edit daily record" variant="outline" small onPress={() => showModal('attendance', { ...employee, leaveType: 'None', leaveDays: '0', extraLeaves: String(employeeExtraLeaveDays(employee)) })} />
                      {['Present', 'Late'].includes(employee.attendance) && (!employee.lunchOut || employee.lunchOut === '—')
                        ? <Button title="Lunch out" variant="outline" small onPress={() => recordLunchPunch(employee.id, 'out')} />
                        : ['Present', 'Late'].includes(employee.attendance) && (!employee.lunchIn || employee.lunchIn === '—')
                          ? <Button title="Lunch in" variant="outline" small onPress={() => recordLunchPunch(employee.id, 'in')} />
                          : null}
                    </>}
                  </View>
                </View>;
              })}
            </View>
          </View>
        </ScrollView>
        <Text style={styles.caption}>* CL (Casual Leave) is excluded from leave totals. Lunch out/in punches are timestamped automatically when recorded. Admins can only manage their assigned employees.</Text>
        {!filteredEmployees.length && <Empty text="No matching employees." />}
      </View>
    </>
  );

  const renderPayroll = () => {
    const total = employees.reduce((sum, employee) => sum + netSalary(employee, payrollMonth), 0);
    return <>
      <SectionTitle title="Payroll & payslips" subtitle={`Salary calculations for ${payrollMonth}. Mark all employee and admin salaries paid before advancing to the next month.`} action={<Button title="Next payroll month" variant="outline" small onPress={advancePayrollMonth} />} />
      <View style={styles.metrics}>
        <Metric label="TOTAL NET PAYROLL" value={money(total)} detail="employees · after deductions" />
        <Metric label="PAYMENTS PENDING" value={employees.filter((employee) => !employee.paid).length} detail="update after review" tone="amber" />
      </View>
      <View style={styles.panel}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ minWidth: 1900 }}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 1.4 }]}>EMPLOYEE</Text><Text style={styles.th}>BASE SALARY</Text><Text style={styles.th}>OT</Text><Text style={styles.th}>EF</Text><Text style={styles.th}>ESI</Text><Text style={styles.th}>PF</Text><Text style={styles.th}>EXTRA LEAVE</Text><Text style={[styles.th, { flex: 1.3 }]}>EXTRA LEAVE DEDUCTION</Text><Text style={styles.th}>LOAN</Text><Text style={[styles.th, { flex: 1.1 }]}>LOAN DEDUCTION</Text><Text style={[styles.th, { flex: 1.2 }]}>LOAN BALANCE</Text><Text style={[styles.th, { flex: 0.8 }]}>MONTHS LEFT</Text><Text style={styles.th}>NET SALARY</Text><Text style={styles.th}>PAYMENT</Text><Text style={[styles.th, { flex: 1.8 }]}>ACTIONS</Text>
            </View>
            {employees.map((employee) => <View key={employee.id} style={styles.tableRow}>
              <View style={{ flex: 1.4 }}><Text style={styles.tdStrong}>{employee.name}</Text><Text style={styles.tdSmall}>{admins.find((admin) => admin.id === employee.adminId)?.name}</Text></View>
              <Text style={styles.td}>{money(employee.base)}</Text><Text style={styles.td}>{money(employeeOvertimeBonus(employee))}</Text><Text style={styles.td}>{money(employee.ef)}</Text><Text style={styles.td}>{money(employee.esi)}</Text><Text style={styles.td}>{money(employee.pf)}</Text>
              <Text style={styles.td}>{employeeExtraLeaveDays(employee)} days</Text><Text style={[styles.td, { flex: 1.3 }]}>{money(extraLeaveDeduction(employee))}</Text>
              <Text style={styles.td}>{money(Number(employee.loanPrincipal) || 0)}</Text><Text style={[styles.td, { flex: 1.1 }]}>{money(loanDeduction(employee, payrollMonth))}</Text><Text style={[styles.td, { flex: 1.2 }]}>{money(loanBalance(employee))}</Text><Text style={[styles.td, { flex: 0.8 }]}>{loanMonthsRemaining(employee)}</Text>
              <Text style={styles.tdStrong}>{money(netSalary(employee, payrollMonth))}</Text>
              <View style={styles.tableCell}><View><Badge tone={employee.paid ? 'green' : 'amber'}>{employee.paid ? 'Paid' : 'Pending'}</Badge>{employee.paymentMethod && <Text style={styles.tdSmall}>{employee.paymentMethod}</Text>}</View></View>
              <View style={[styles.tableCell, { flex: 1.8 }]}><Button title="Edit" variant="soft" small onPress={() => openPayrollEditor(employee)} /><Button title="Download PDF" variant="outline" small onPress={() => generatePayslip(employee)} /></View>
            </View>)}
          </View>
        </ScrollView>
        <Text style={styles.caption}>Net = base + OT − EF − ESI − PF − extra-leave deduction − loan installment. Extra-leave deduction defaults to base salary ÷ 30 per day. Casual Leave is not counted.</Text>
      </View>
    </>;
  };

  const renderTeamPayroll = () => <>
    <SectionTitle title="Team payroll" subtitle={`Payroll components and payment status for your assigned employees · ${payrollMonth}.`} />
    <View style={styles.metrics}>
      <Metric label="TEAM NET PAYROLL" value={money(visibleEmployees.reduce((sum, employee) => sum + netSalary(employee, payrollMonth), 0))} detail="after deductions" />
      <Metric label="PAYMENTS PENDING" value={visibleEmployees.filter((employee) => !employee.paid).length} detail={payrollMonth} tone="amber" />
      <Metric label="PAYMENTS COMPLETE" value={visibleEmployees.filter((employee) => employee.paid).length} detail="assigned employees" tone="green" />
    </View>
    <View style={styles.panel}>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={{ minWidth: 1850 }}>
          <View style={styles.tableHeader}><Text style={[styles.th, { flex: 1.5 }]}>EMPLOYEE</Text><Text style={styles.th}>BASE SALARY</Text><Text style={styles.th}>OT</Text><Text style={styles.th}>EF</Text><Text style={styles.th}>ESI</Text><Text style={styles.th}>PF</Text><Text style={styles.th}>EXTRA LEAVE</Text><Text style={[styles.th, { flex: 1.2 }]}>EXTRA LEAVE DEDUCTION</Text><Text style={styles.th}>LOAN</Text><Text style={[styles.th, { flex: 1.1 }]}>LOAN DEDUCTION</Text><Text style={[styles.th, { flex: 1.2 }]}>LOAN BALANCE</Text><Text style={[styles.th, { flex: 0.8 }]}>MONTHS LEFT</Text><Text style={styles.th}>NET SALARY</Text><Text style={styles.th}>PAYMENT</Text><Text style={styles.th}>PDF</Text></View>
          {visibleEmployees.map((employee) => <View key={employee.id} style={styles.tableRow}>
            <View style={{ flex: 1.5 }}><Text style={styles.tdStrong}>{employee.name}</Text><Text style={styles.tdSmall}>{employee.title} · {employee.department}</Text></View>
            <Text style={styles.td}>{money(employee.base)}</Text><Text style={styles.td}>{money(employeeOvertimeBonus(employee))}</Text><Text style={styles.td}>{money(employee.ef)}</Text><Text style={styles.td}>{money(employee.esi)}</Text><Text style={styles.td}>{money(employee.pf)}</Text>
            <Text style={styles.td}>{employeeExtraLeaveDays(employee)} days</Text><Text style={[styles.td, { flex: 1.2 }]}>{money(extraLeaveDeduction(employee))}</Text>
            <Text style={styles.td}>{money(Number(employee.loanPrincipal) || 0)}</Text><Text style={[styles.td, { flex: 1.1 }]}>{money(loanDeduction(employee, payrollMonth))}</Text><Text style={[styles.td, { flex: 1.2 }]}>{money(loanBalance(employee))}</Text><Text style={[styles.td, { flex: 0.8 }]}>{loanMonthsRemaining(employee)}</Text>
            <Text style={styles.tdStrong}>{money(netSalary(employee, payrollMonth))}</Text>
            <View style={styles.tableCell}><View><Badge tone={employee.paid ? 'green' : 'amber'}>{employee.paid ? 'Paid' : 'Pending'}</Badge>{employee.paymentMethod && <Text style={styles.tdSmall}>{employee.paymentMethod}</Text>}</View></View>
            <View style={styles.tableCell}><Button title="Download PDF" variant="outline" small onPress={() => generatePayslip(employee)} /></View>
          </View>)}
        </View>
      </ScrollView>
      <Text style={styles.caption}>Payroll access is read-only. Only the Super Admin can update employee payroll components.</Text>
    </View>
  </>;

  const renderAdminPayroll = () => {
    if (!isSuper) return null;
    const total = admins.reduce((sum, admin) => sum + adminNetSalary(admin, payrollMonth), 0);
    return <>
      <SectionTitle title="Admin payroll" subtitle={`Admin salary calculations and payment status for ${payrollMonth}.`} />
      <View style={styles.metrics}>
        <Metric label="TOTAL ADMIN NET PAYROLL" value={money(total)} detail="admins · after deductions" />
        <Metric label="PAYMENTS PENDING" value={admins.filter((admin) => !admin.paid).length} detail={payrollMonth} tone="amber" />
      </View>
      <View style={styles.panel}>
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={{ minWidth: 2200 }}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 1.5 }]}>ADMIN</Text>
              <Text style={styles.th}>BASE SALARY</Text>
              <Text style={styles.th}>OT</Text>
              <Text style={styles.th}>EF</Text>
              <Text style={styles.th}>ESI</Text>
              <Text style={styles.th}>PF</Text>
              <Text style={styles.th}>EXTRA LEAVE</Text>
              <Text style={[styles.th, { flex: 1.3 }]}>EXTRA LEAVE DEDUCTION</Text>
              <Text style={styles.th}>LOAN</Text>
              <Text style={[styles.th, { flex: 1.1 }]}>LOAN DEDUCTION</Text>
              <Text style={[styles.th, { flex: 1.2 }]}>LOAN BALANCE</Text>
              <Text style={[styles.th, { flex: 0.8 }]}>MONTHS LEFT</Text>
              <Text style={styles.th}>NET SALARY</Text>
              <Text style={styles.th}>PAYMENT</Text>
              <Text style={[styles.th, { flex: 1.8 }]}>ACTIONS</Text>
            </View>
            {admins.map((admin) => <View key={`payroll-${admin.id}`} style={styles.tableRow}>
              <View style={{ flex: 1.5 }}><Text style={styles.tdStrong}>{admin.name}</Text><Text style={styles.tdSmall}>{admin.title}</Text></View>
              <Text style={styles.td}>{money(admin.salary)}</Text>
              <Text style={styles.td}>{money(overtimeBonus(admin))}</Text>
              <Text style={styles.td}>{money(admin.ef)}</Text>
              <Text style={styles.td}>{money(admin.esi)}</Text>
              <Text style={styles.td}>{money(admin.pf)}</Text>
              <Text style={styles.td}>{adminExtraLeaveDays(admin)} days</Text>
              <Text style={[styles.td, { flex: 1.3 }]}>{money(adminExtraLeaveDeduction(admin))}</Text>
              <Text style={styles.td}>{money(Number(admin.loanPrincipal) || 0)}</Text>
              <Text style={[styles.td, { flex: 1.1 }]}>{money(loanDeduction(admin, payrollMonth))}</Text>
              <Text style={[styles.td, { flex: 1.2 }]}>{money(loanBalance(admin))}</Text>
              <Text style={[styles.td, { flex: 0.8 }]}>{loanMonthsRemaining(admin)}</Text>
              <Text style={styles.tdStrong}>{money(adminNetSalary(admin, payrollMonth))}</Text>
              <View style={styles.tableCell}><View><Badge tone={admin.paid ? 'green' : 'amber'}>{admin.paid ? 'Paid' : 'Pending'}</Badge>{admin.paymentMethod && <Text style={styles.tdSmall}>{admin.paymentMethod}</Text>}</View></View>
              <View style={[styles.tableCell, { flex: 1.8 }]}>
                <Button title="Edit" variant="soft" small onPress={() => openAdminSalaryEditor(admin)} />
                <Button title="Download PDF" variant="outline" small onPress={() => generateAdminPayslip(admin)} />
              </View>
            </View>)}
          </View>
        </ScrollView>
        <Text style={styles.caption}>Net = base + OT − EF − ESI − PF − extra-leave deduction − loan installment. Casual Leave is excluded. OT is calculated from the admin’s shift and punch times.</Text>
      </View>
    </>;
  };

  const renderMyProfile = () => ownAdmin ? <>
    <SectionTitle title="My profile" subtitle="View your admin contact information." />
    <View style={styles.profileCard}><View style={styles.avatarLarge}><Text style={styles.avatarText}>{ownAdmin.name.split(' ').map((part) => part[0]).join('')}</Text></View><Text style={styles.profileName}>{ownAdmin.name}</Text><Text style={styles.cardSub}>{ownAdmin.title}</Text><View style={styles.profileDetails}><Text style={styles.bodyText}>{ownAdmin.email}</Text><Text style={styles.bodyText}>{ownAdmin.phone}</Text><Text style={styles.bodyText}>Assigned team size: {ownAdmin.employeeIds.length}</Text></View></View>
  </> : null;

  const renderMySalary = () => ownAdmin ? <>
    <SectionTitle title="My salary" subtitle={`Admin salary details and payment status for ${payrollMonth}.`} action={<Button title="Download PDF receipt" variant="outline" small onPress={() => generateAdminPayslip(ownAdmin)} />} />
    <View style={styles.metrics}><Metric label="MONTHLY SALARY" value={money(ownAdmin.salary)} detail="set by Super Admin" /><Metric label="PAYMENT STATUS" value={ownAdmin.paid ? 'Paid' : 'Pending'} detail={payrollMonth} tone={ownAdmin.paid ? 'green' : 'amber'} /><Metric label="LEAVES · CL EXCLUDED" value={countedLeaveDays(ownAdmin.leaves)} detail={`${emergencyDays(ownAdmin.leaves)} emergency leave days`} tone="blue" /></View>
    <View style={styles.panel}><Text style={styles.cardTitle}>Salary and leave summary</Text><Text style={styles.bodyText}>Your salary and payment status are read-only. Contact the Super Admin if you have a question. Casual Leave (CL) is excluded from the leave total.</Text></View>
  </> : null;

  const content = tab === 'Overview' ? renderOverview()
    : tab === 'Admins' ? renderAdmins()
    : tab === 'Admin payroll' && isSuper ? renderAdminPayroll()
    : ((tab === 'Employees' && isSuper) || (tab === 'My team' && !hasPayrollAccess)) ? renderEmployees()
    : tab === 'Team payroll' && hasPayrollAccess ? renderTeamPayroll()
    : tab === 'Payroll' && isSuper ? renderPayroll()
    : tab === 'My profile' ? renderMyProfile()
    : renderOverview();
  const selectedAdminHistory = admins.find((admin) => admin.id === selectedAdminHistoryId);

  return (
    <View style={styles.app}>
      <StatusBar barStyle="dark-content" />
      {wide && <View style={styles.sidebar}>
        <View style={styles.brandRow}><View style={styles.sidebarBrandMark}><Text style={styles.sidebarBrandMarkText}>H</Text></View><View><Text style={styles.sidebarBrandName}>HRMS</Text><Text style={styles.sidebarBrandSub}>PEOPLE OPERATIONS</Text></View></View>
        <Text style={styles.navLabel}>WORKSPACE</Text>
        {tabs.map((item) => <Pressable key={item} onPress={() => { setTab(item); setFilter(''); }} style={[styles.navItem, tab === item && styles.navItemActive]}><Text style={[styles.navIcon, tab === item && styles.navIconActive]}>{({ Overview: '◫', Admins: '♙', 'Admin payroll': '$', Employees: '♧', 'My team': '♧', 'Team payroll': '$', Payroll: '$', 'My profile': '○', 'My salary': '$' })[item]}</Text><Text style={[styles.navText, tab === item && styles.navTextActive]}>{item}</Text></Pressable>)}
        <View style={styles.sidebarFoot}><View style={styles.signedAvatar}><Text style={styles.signedAvatarText}>{user.name.split(' ').map((part) => part[0]).join('')}</Text></View><View style={{ flex: 1 }}><Text style={styles.signedName}>{user.name}</Text><Text style={styles.signedRole}>{isSuper ? 'Super Admin' : 'Admin'}</Text></View><Pressable onPress={() => setUser(null)}><Text style={styles.signOut}>↗</Text></Pressable></View>
      </View>}
      <View style={styles.main}>
        <View style={[styles.topbar, !wide && styles.topbarCompact]}>
          {!wide && <View style={styles.brandRow}><Text style={styles.brandName}>HRMS</Text></View>}
          <View style={{ flex: 1 }} />
          <Text style={[styles.topbarDate, !wide && styles.topbarCompactDate]}>{attendanceDateLabel}</Text>
          <View style={styles.topbarDivider} />
          <View style={[styles.userChip, !wide && styles.userChipCompact]}><View style={styles.signedAvatar}><Text style={styles.signedAvatarText}>{user.name.split(' ').map((part) => part[0]).join('')}</Text></View><View style={!wide && styles.topbarUserDetailsCompact}><Text numberOfLines={1} style={[styles.signedName, !wide && styles.signedNameCompact]}>{user.name}</Text><Text style={styles.signedRole}>{isSuper ? 'Super Admin' : 'Admin'}</Text></View></View>
          <Pressable style={[styles.logoutButton, !wide && styles.logoutButtonCompact]} onPress={() => setUser(null)}><Text style={styles.logoutText}>Sign out</Text></Pressable>
        </View>
        {!wide && <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mobileNav}>{tabs.map((item) => <Pressable key={item} onPress={() => setTab(item)} style={[styles.mobileNavItem, tab === item && styles.mobileNavActive]}><Text style={[styles.mobileNavText, tab === item && styles.mobileNavTextActive]}>{item}</Text></Pressable>)}</ScrollView>}
        <ScrollView style={styles.contentScroll} contentContainerStyle={[styles.content, !wide && styles.contentCompact]}>
          <View style={styles.pageHeading}><Text style={styles.pageKicker}>{isSuper ? 'SUPER ADMIN CONSOLE' : 'ADMIN WORKSPACE'}</Text><Text style={styles.pageTitle}>{tab}</Text></View>
          {content}
          <Text style={styles.footerText}>NORTHSTAR HRMS · {payrollMonth} · {isSuper ? 'ORGANISATION-WIDE ACCESS' : 'ADMIN ACCESS'}</Text>
        </ScrollView>
      </View>
      <Modal visible={!!modal} transparent animationType="fade" onRequestClose={() => setModal(null)}>
        <View style={styles.modalBackdrop}><View style={styles.modalCard}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.modalHead}><Text style={styles.modalTitle}>{modal === 'newAdmin' ? 'Create admin account' : modal === 'newEmployee' ? 'Add employee' : modal === 'team' ? 'Manage team assignment' : modal === 'replaceEmployee' ? 'Replace employee' : modal === 'adminAttendance' ? 'Edit admin attendance' : modal === 'adminAttendanceHistory' ? 'Monthly admin attendance' : modal === 'biometricSync' ? 'Biometric attendance sync' : modal === 'attendance' ? 'Edit attendance and times' : modal === 'payroll' ? 'Edit employee payroll' : modal === 'adminSalary' ? 'Admin salary' : modal === 'employeeDetail' ? 'Employee details' : modal === 'editAdmin' ? 'Edit admin' : 'Edit employee information'}</Text><Pressable onPress={() => setModal(null)}><Text style={styles.closeText}>✕</Text></Pressable></View>
            {modal === 'adminAttendanceHistory' && selectedAdminHistory && renderAdminAttendanceHistory(selectedAdminHistory)}
            {modal === 'biometricSync' && <>
              <Text style={styles.bodyText}>Sync today’s punch records from the office biometric device API. Employee and admin records will be updated only for {attendanceDateLabel}.</Text>
              <Field label="Biometric API URL" value={biometricEndpoint} onChangeText={setBiometricEndpoint} placeholder="http://office-device-ip/api/attendance" />
              <Field label="Bearer token (optional)" value={biometricToken} onChangeText={setBiometricToken} secureTextEntry />
              <Text style={styles.caption}>The API must return a JSON array or an object with a records, events, logs, data, or attendance array. Each record should include an employee/admin identifier and punch timestamp, direction, or check type.</Text>
              <Button title="Sync now" onPress={syncBiometricAttendance} />
            </>}
            {modal === 'newEmployee' && <>
              <Field label="Full name" value={draft.name || ''} onChangeText={(value) => setDraft({ ...draft, name: value })} />
              <Field label="Work email" value={draft.email || ''} onChangeText={(value) => setDraft({ ...draft, email: value })} keyboardType="email-address" />
              <Field label="Phone" value={draft.phone || ''} onChangeText={(value) => setDraft({ ...draft, phone: value })} />
              <Field label="Job title" value={draft.title || ''} onChangeText={(value) => setDraft({ ...draft, title: value })} />
              <Field label="Department" value={draft.department || ''} onChangeText={(value) => setDraft({ ...draft, department: value })} />
              <Field label="Shift" value={draft.shift || ''} onChangeText={(value) => setDraft({ ...draft, shift: value })} />
              <Text style={styles.caption}>New employees start unassigned. They can be assigned to an admin from the Admin accounts page.</Text>
              <Button title="Add unassigned employee" onPress={saveNewEmployee} />
            </>}
            {modal === 'team' && <>
              <Text style={styles.bodyText}>Select employees for {admins.find((admin) => admin.id === draft.id)?.name}. Employees assigned to another admin are unavailable.</Text>
              {employees.map((employee) => {
                const currentOwner = admins.find((admin) => admin.id !== draft.id && admin.employeeIds.includes(employee.id));
                const checked = (draft.employeeIds || []).includes(employee.id);
                return <Pressable key={employee.id} style={styles.checkRow} disabled={!!currentOwner} onPress={() => setDraft({ ...draft, employeeIds: checked ? draft.employeeIds.filter((item) => item !== employee.id) : [...(draft.employeeIds || []), employee.id] })}><Text style={[styles.checkBox, checked && styles.checkBoxOn]}>{checked ? '✓' : ''}</Text><Text style={[styles.checkLabel, currentOwner && styles.disabledText]}>{employee.name}{currentOwner ? ` · assigned to ${currentOwner.name}` : !employee.adminId && !checked ? ' · unassigned' : ''}</Text></Pressable>;
              })}
              <Text style={styles.caption}>Released employees return to the unassigned pool.</Text>
              <Button title="Save team assignment" onPress={saveTeamAssignment} />
            </>}
            {modal === 'replaceEmployee' && <>
              <Text style={styles.bodyText}>Replace one employee in {admins.find((admin) => admin.id === draft.id)?.name}'s team with an employee from another admin group.</Text>
              <Text style={styles.fieldLabel}>Employee to replace</Text>
              {employees.filter((employee) => admins.find((admin) => admin.id === draft.id)?.employeeIds.includes(employee.id)).map((employee) => <Pressable key={`out-${employee.id}`} style={styles.checkRow} onPress={() => setDraft({ ...draft, outgoingId: employee.id })}><Text style={[styles.checkBox, draft.outgoingId === employee.id && styles.checkBoxOn]}>{draft.outgoingId === employee.id ? '✓' : ''}</Text><Text style={styles.checkLabel}>{employee.name}</Text></Pressable>)}
              <Text style={styles.fieldLabel}>Replacement from another admin</Text>
              {employees.map((employee) => {
                const owner = admins.find((admin) => admin.employeeIds.includes(employee.id));
                if (!owner || owner.id === draft.id) return null;
                return <Pressable key={`in-${employee.id}`} style={styles.checkRow} onPress={() => setDraft({ ...draft, incomingId: employee.id })}><Text style={[styles.checkBox, draft.incomingId === employee.id && styles.checkBoxOn]}>{draft.incomingId === employee.id ? '✓' : ''}</Text><Text style={styles.checkLabel}>{employee.name} · from {owner.name}</Text></Pressable>;
              })}
              <Text style={styles.caption}>The outgoing employee moves to the replacement employee's previous admin group.</Text>
              <Button title="Replace employee" onPress={saveEmployeeReplacement} />
            </>}
            {modal === 'newAdmin' && <>
              <Field label="Full name" value={draft.name || ''} onChangeText={(value) => setDraft({ ...draft, name: value })} />
              <Field label="Admin email" value={draft.email || ''} onChangeText={(value) => setDraft({ ...draft, email: value })} keyboardType="email-address" />
              <Field label="Password assigned by Super Admin" value={draft.password || ''} onChangeText={(value) => setDraft({ ...draft, password: value })} secureTextEntry />
              <Field label="Phone" value={draft.phone || ''} onChangeText={(value) => setDraft({ ...draft, phone: value })} />
              <Field label="Job title" value={draft.title || ''} onChangeText={(value) => setDraft({ ...draft, title: value })} />
              <Field label="Monthly salary" value={String(draft.salary ?? '')} onChangeText={(value) => setDraft({ ...draft, salary: value })} keyboardType="numeric" />
              <Text style={styles.fieldLabel}>Assign employees</Text>
              {employees.map((employee) => {
                const currentOwner = admins.find((admin) => admin.employeeIds.includes(employee.id));
                const checked = (draft.employeeIds || []).includes(employee.id);
                const unavailable = !!currentOwner;
                return <Pressable key={employee.id} style={styles.checkRow} disabled={unavailable} onPress={() => setDraft({ ...draft, employeeIds: checked ? draft.employeeIds.filter((item) => item !== employee.id) : [...(draft.employeeIds || []), employee.id] })}><Text style={[styles.checkBox, checked && styles.checkBoxOn]}>{checked ? '✓' : ''}</Text><Text style={[styles.checkLabel, unavailable && styles.disabledText]}>{employee.name}{unavailable ? ` · assigned to ${currentOwner.name}` : ''}</Text></Pressable>;
              })}
              <Text style={styles.caption}>Only unassigned employees can be selected. Admin team changes are managed by the Super Admin. The new admin's login credentials will be shown after account creation so you can share them directly.</Text>
              <Button title="Create admin and assign team" onPress={saveNewAdmin} />
            </>}
            {modal === 'editAdmin' && <>
              <Field label="Full name" value={draft.name || ''} onChangeText={(value) => setDraft({ ...draft, name: value })} />
              <Field label="Work email" value={draft.email || ''} onChangeText={(value) => setDraft({ ...draft, email: value })} keyboardType="email-address" />
              <Field label="Phone" value={draft.phone || ''} onChangeText={(value) => setDraft({ ...draft, phone: value })} />
              <Field label="Job title" value={draft.title || ''} onChangeText={(value) => setDraft({ ...draft, title: value })} />
              {isSuper && <Field label="Set / reset password" value={draft.newPassword || ''} onChangeText={(value) => setDraft({ ...draft, newPassword: value })} secureTextEntry />}
              <Button title="Save changes" onPress={saveAdminProfile} />
              {isSuper && <Text style={styles.caption}>Share the new sign-in email and password directly with this admin. Passwords in this prototype are not securely stored.</Text>}
            </>}
            {modal === 'adminAttendance' && <>
              <Text style={styles.bodyText}>Manually manage today’s attendance and allocated shift for {draft.name}. Use 24-hour HH:MM times.</Text>
              <Text style={styles.fieldLabel}>Attendance status</Text>
              <View style={styles.choiceRow}>{['Present', 'Late', 'On leave', 'Absent'].map((status) => <Pressable key={status} onPress={() => setDraft({ ...draft, attendance: status, ...(status === 'On leave' || status === 'Absent' ? { punchIn: '—', punchOut: '—', breakIn: '—', breakOut: '—', lunchOut: '—', lunchIn: '—' } : {}) })} style={[styles.choice, draft.attendance === status && styles.choiceActive]}><Text style={[styles.choiceText, draft.attendance === status && styles.choiceTextActive]}>{status}</Text></Pressable>)}</View>
              {(draft.attendance === 'Present' || draft.attendance === 'Late') && <>
                <Field label="Allocated shift" value={draft.shift || ''} onChangeText={(value) => setDraft({ ...draft, shift: value })} placeholder="09:00 – 17:00" />
                <Field label="Punch in · HH:MM" value={draft.punchIn || ''} onChangeText={(value) => setDraft({ ...draft, punchIn: value })} placeholder="09:00" />
                <Field label="Punch out · HH:MM" value={draft.punchOut || ''} onChangeText={(value) => setDraft({ ...draft, punchOut: value })} placeholder="17:00" />
                <Field label="Break in · HH:MM" value={draft.breakIn || ''} onChangeText={(value) => setDraft({ ...draft, breakIn: value })} placeholder="12:30" />
                <Field label="Break out · HH:MM" value={draft.breakOut || ''} onChangeText={(value) => setDraft({ ...draft, breakOut: value })} placeholder="13:00" />
                <Field label="Lunch break out · HH:MM" value={draft.lunchOut || ''} onChangeText={(value) => setDraft({ ...draft, lunchOut: value })} placeholder="13:10" />
                <Field label="Lunch break in · HH:MM" value={draft.lunchIn || ''} onChangeText={(value) => setDraft({ ...draft, lunchIn: value })} placeholder="13:40" />
              </>}
              <Text style={styles.fieldLabel}>Leave record · Casual Leave excluded</Text>
              <View style={styles.choiceRow}>{['None', 'Annual', 'Sick', 'Emergency', 'Casual'].map((type) => <Pressable key={type} onPress={() => setDraft({ ...draft, leaveType: type })} style={[styles.choice, (draft.leaveType || 'None') === type && styles.choiceActive]}><Text style={[styles.choiceText, (draft.leaveType || 'None') === type && styles.choiceTextActive]}>{type}</Text></Pressable>)}</View>
              {(draft.leaveType || 'None') !== 'None' && <Field label="Leave days" value={draft.leaveDays || '0'} onChangeText={(value) => setDraft({ ...draft, leaveDays: value })} keyboardType="numeric" />}
              <Button title="Save admin attendance" onPress={saveAdminAttendance} />
            </>}
            {modal === 'editEmployee' && <>
              <Field label="Full name" value={draft.name || ''} onChangeText={(value) => setDraft({ ...draft, name: value })} />
              <Field label="Work email" value={draft.email || ''} onChangeText={(value) => setDraft({ ...draft, email: value })} keyboardType="email-address" />
              <Field label="Phone" value={draft.phone || ''} onChangeText={(value) => setDraft({ ...draft, phone: value })} />
              <Field label="Job title" value={draft.title || ''} onChangeText={(value) => setDraft({ ...draft, title: value })} />
              <Field label="Department" value={draft.department || ''} onChangeText={(value) => setDraft({ ...draft, department: value })} />
              <Field label="Shift" value={draft.shift || ''} onChangeText={(value) => setDraft({ ...draft, shift: value })} />
              <Button title="Save employee information" onPress={saveEmployee} />
            </>}
            {modal === 'attendance' && <>
              <Text style={styles.bodyText}>Manually record today’s attendance and punch/break times for {draft.name}. Use 24-hour HH:MM, or leave a time blank.</Text>
              <Text style={styles.fieldLabel}>Attendance status</Text>
              <View style={styles.choiceRow}>{['Present', 'Late', 'On leave', 'Absent'].map((status) => <Pressable key={status} onPress={() => setDraft({ ...draft, attendance: status, ...(status === 'On leave' || status === 'Absent' ? { punchIn: '—', punchOut: '—', breakIn: '—', breakOut: '—' } : {}) })} style={[styles.choice, draft.attendance === status && styles.choiceActive]}><Text style={[styles.choiceText, draft.attendance === status && styles.choiceTextActive]}>{status}</Text></Pressable>)}</View>
              {(draft.attendance === 'Present' || draft.attendance === 'Late') && <>
                <Field label="Punch in · HH:MM" value={draft.punchIn || ''} onChangeText={(value) => setDraft({ ...draft, punchIn: value })} placeholder="09:00" />
                <Field label="Punch out · HH:MM" value={draft.punchOut || ''} onChangeText={(value) => setDraft({ ...draft, punchOut: value })} placeholder="17:00" />
                <Field label="Break in · HH:MM" value={draft.breakIn || ''} onChangeText={(value) => setDraft({ ...draft, breakIn: value })} placeholder="12:30" />
                <Field label="Break out · HH:MM" value={draft.breakOut || ''} onChangeText={(value) => setDraft({ ...draft, breakOut: value })} placeholder="13:00" />
              </>}
              {draft.attendance === 'Present' && <Text style={styles.bodyText}>Record the employee’s available punch and break times.</Text>}
              {draft.attendance === 'Late' && <Text style={styles.bodyText}>{lateByMinutes(draft.punchIn, draft.shift) === null ? `Enter a punch-in time to compare with the ${draft.shift} shift.` : `Late by ${lateByMinutes(draft.punchIn, draft.shift)} minutes from the scheduled shift start.`}</Text>}
              <Text style={styles.fieldLabel}>Leave record</Text>
              <View style={styles.choiceRow}>{['None', 'Annual', 'Sick', 'Emergency', 'Casual'].map((type) => <Pressable key={type} onPress={() => setDraft({ ...draft, leaveType: type })} style={[styles.choice, (draft.leaveType || 'None') === type && styles.choiceActive]}><Text style={[styles.choiceText, (draft.leaveType || 'None') === type && styles.choiceTextActive]}>{type}</Text></Pressable>)}</View>
              {(draft.leaveType || 'None') !== 'None' && <Field label="Leave days" value={String(draft.leaveDays || '0')} onChangeText={(value) => setDraft({ ...draft, leaveDays: value })} keyboardType="numeric" />}
              <Field label="Extra leave days" value={String(draft.extraLeaves || '0')} onChangeText={(value) => setDraft({ ...draft, extraLeaves: value })} keyboardType="numeric" />
              <Text style={styles.caption}>Leave records are limited to the employees assigned to your admin account. Casual Leave is excluded from counted leave totals.</Text>
              {draft.attendance === 'On leave' && <View style={styles.notice}><Text style={styles.noticeTitle}>On leave</Text><Text style={styles.noticeText}>Punch and break times will be cleared. Recorded non-casual leave: {(draft.leaves || []).filter((leave) => leave.type !== 'Casual').map((leave) => `${leave.type} (${leave.days} day${leave.days === 1 ? '' : 's'})`).join(', ') || 'none'} · {countedLeaveDays(draft.leaves || [])} total days.</Text></View>}
              {draft.attendance === 'Absent' && <View style={styles.notice}><Text style={styles.noticeTitle}>Absent</Text><Text style={styles.noticeText}>No punch or break times apply. Existing times will be cleared when you save.</Text></View>}
              <Button title="Save attendance and times" onPress={saveAttendance} />
            </>}
            {modal === 'employeeDetail' && selectedEmployee && <>
              <View style={styles.detailBlock}><Text style={styles.detailLabel}>PERSONAL INFORMATION</Text><Text style={styles.detailValue}>{selectedEmployee.name} · {selectedEmployee.title}</Text><Text style={styles.bodyText}>{selectedEmployee.email} · {selectedEmployee.phone}</Text><Text style={styles.bodyText}>{selectedEmployee.department} · Shift {selectedEmployee.shift}</Text></View>
              <View style={styles.detailBlock}><Text style={styles.detailLabel}>ATTENDANCE · {attendanceDateLabel.toUpperCase()}</Text><Text style={styles.detailValue}>{selectedEmployee.attendance}</Text><Text style={styles.bodyText}>Punch in {selectedEmployee.punchIn} · Punch out {selectedEmployee.punchOut}</Text><Text style={styles.bodyText}>Break {selectedEmployee.breakIn} – {selectedEmployee.breakOut}</Text><Text style={styles.bodyText}>Lunch out {selectedEmployee.lunchOut || '—'} · Lunch in {selectedEmployee.lunchIn || '—'}{lunchBreakMinutes(selectedEmployee) !== null ? ` · ${lunchBreakMinutes(selectedEmployee)} min` : ''}</Text></View>
              <View style={styles.detailBlock}><Text style={styles.detailLabel}>LEAVES · CL EXCLUDED</Text><Text style={styles.detailValue}>{countedLeaveDays(selectedEmployee.leaves)} days · {emergencyDays(selectedEmployee.leaves)} emergency</Text><Text style={styles.bodyText}>Casual leave is excluded from the total.</Text></View>
              {isSuper && renderAttendanceCalendar(selectedEmployee)}
              {isSuper && <Button title="Edit personal information" variant="soft" onPress={() => showModal('editEmployee', { ...selectedEmployee })} />}
              {!isSuper && <Button title="Edit daily attendance, leave and extra leave" variant="outline" onPress={() => showModal('attendance', { ...selectedEmployee, leaveType: 'None', leaveDays: '0', extraLeaves: String(employeeExtraLeaveDays(selectedEmployee)) })} />}
              <Text style={styles.caption}>{isSuper ? 'Attendance records are view-only here and are maintained by the assigned admin.' : 'Your edits are visible to the Super Admin for oversight.'}</Text>
            </>}
            {modal === 'payroll' && <>
              <Text style={styles.bodyText}>For {draft.name}. Amounts are monthly INR values.</Text>
              <Field label="Base salary" value={String(draft.base ?? '')} onChangeText={(value) => setDraft({ ...draft, base: value, extraLeaveDeduction: String(calculateExtraLeaveDeduction(value, draft.extraLeaves)) })} keyboardType="numeric" />
              <Field label="Overtime earnings" value={String(draft.overtime ?? '')} onChangeText={(value) => setDraft({ ...draft, overtime: value })} keyboardType="numeric" editable={false} />
              <Field label="EF deduction" value={String(draft.ef ?? '')} onChangeText={(value) => setDraft({ ...draft, ef: value })} keyboardType="numeric" />
              <Field label="ESI deduction" value={String(draft.esi ?? '')} onChangeText={(value) => setDraft({ ...draft, esi: value })} keyboardType="numeric" />
              <Field label="PF deduction" value={String(draft.pf ?? '')} onChangeText={(value) => setDraft({ ...draft, pf: value })} keyboardType="numeric" />
              <Field label="Extra leave days" value={String(draft.extraLeaves ?? '0')} onChangeText={(value) => setDraft({ ...draft, extraLeaves: value, extraLeaveDeduction: String(calculateExtraLeaveDeduction(draft.base, value)) })} keyboardType="numeric" />
              <Field label="Extra leave deduction" value={Number(draft.extraLeaves) > 0 ? String(draft.extraLeaveDeduction ?? '0') : '0'} onChangeText={(value) => setDraft({ ...draft, extraLeaveDeduction: Number(draft.extraLeaves) > 0 ? value : '0' })} keyboardType="numeric" />
              <Text style={styles.caption}>The default per-day deduction is base salary ÷ 30. The total updates with base salary or extra leave days; you can also edit the total deduction directly.</Text>
              {loanBalance(draft) > 0 ? <View style={styles.loanSummary}>
                <Text style={styles.fieldLabel}>Active employee loan</Text>
                <Text style={styles.bodyText}>Original loan: {money(draft.loanPrincipal)} · Remaining balance: {money(loanBalance(draft))}</Text>
                <Text style={styles.bodyText}>This month’s installment: {money(payrollDraftLoanDeduction(draft, payrollMonth))} · {loanMonthsRemaining(isPositiveInteger(draft.newLoanMonths) ? { ...draft, loanTermMonths: (Number(draft.loanMonthsPaid) || 0) + Number(draft.newLoanMonths) } : draft)} months left</Text>
                <Field label="Remaining repayment months chosen by employee" value={String(draft.newLoanMonths ?? '')} onChangeText={(value) => setDraft({ ...draft, newLoanMonths: value })} keyboardType="numeric" placeholder="e.g. 12" />
              </View> : <>
                <Field label="New employee loan amount" value={String(draft.newLoanAmount ?? '')} onChangeText={(value) => setDraft({ ...draft, newLoanAmount: value })} keyboardType="numeric" placeholder="0" />
                <Field label="Repayment term chosen by employee (months)" value={String(draft.newLoanMonths ?? '')} onChangeText={(value) => setDraft({ ...draft, newLoanMonths: value })} keyboardType="numeric" placeholder="e.g. 12" />
                <Text style={styles.caption}>Enter the employee-selected positive whole-number term. No maximum repayment term is imposed. Record the loan before marking this month’s salary paid.</Text>
                {Number(draft.newLoanAmount) > 0 && isPositiveInteger(draft.newLoanMonths) && <Text style={styles.bodyText}>Estimated monthly installment: {money(payrollDraftLoanDeduction(draft, payrollMonth))}</Text>}
              </>}
              <Text style={styles.fieldLabel}>Payment status</Text>
              <View style={styles.choiceRow}>{['Pending', 'Paid'].map((status) => <Pressable key={status} onPress={() => setDraft({ ...draft, paid: status === 'Paid' })} style={[styles.choice, (!!draft.paid) === (status === 'Paid') && styles.choiceActive]}><Text style={[styles.choiceText, (!!draft.paid) === (status === 'Paid') && styles.choiceTextActive]}>{status}</Text></Pressable>)}</View>
              <PaymentMethodFields
                method={draft.paymentMethod || ''}
                details={draft.paymentDetails || {}}
                amount={payrollDraftNetSalary(draft, payrollMonth)}
                onMethodChange={(paymentMethod) => setDraft({ ...draft, paymentMethod, paymentDetails: { ...(draft.paymentDetails || {}), paymentDate: draft.paymentDetails?.paymentDate || currentDate() } })}
                onDetailsChange={(paymentDetails) => setDraft({ ...draft, paymentDetails })}
              />
              <Text style={styles.calculatedNet}>Calculated net salary: {money(payrollDraftNetSalary(draft, payrollMonth))}</Text>
              <View style={styles.rowActions}>
                <Button title="Save" small onPress={savePayroll} />
                <Button title="Cancel" variant="outline" small onPress={() => setModal(null)} />
              </View>
            </>}
            {modal === 'adminSalary' && <>
              <Text style={styles.bodyText}>Set the admin payroll and update payment status for {payrollMonth}.</Text>
              <Field label="Monthly salary" value={String(draft.salaryText || '')} onChangeText={(value) => setDraft({ ...draft, salaryText: value })} keyboardType="numeric" />
              <Field label="Overtime earnings (calculated automatically)" value={money(overtimeBonus(draft))} editable={false} />
              <Field label="EF deduction" value={String(draft.efText ?? '0')} onChangeText={(value) => setDraft({ ...draft, efText: value })} keyboardType="numeric" />
              <Field label="ESI deduction" value={String(draft.esiText ?? '0')} onChangeText={(value) => setDraft({ ...draft, esiText: value })} keyboardType="numeric" />
              <Field label="PF deduction" value={String(draft.pfText ?? '0')} onChangeText={(value) => setDraft({ ...draft, pfText: value })} keyboardType="numeric" />
              <Field label="Extra leave days (from admin attendance; Casual Leave excluded)" value={String(draft.extraLeaveText ?? '0')} editable={false} />
              <Field label="Extra leave deduction" value={Number(draft.extraLeaveText) > 0 ? String(calculateExtraLeaveDeduction(draft.salaryText, draft.extraLeaveText)) : '0'} editable={false} />
              {loanBalance(draft) > 0 ? <View style={styles.loanSummary}>
                <Text style={styles.fieldLabel}>Active admin loan</Text>
                <Text style={styles.bodyText}>Original loan: {money(draft.loanPrincipal)} · Remaining balance: {money(loanBalance(draft))}</Text>
                <Text style={styles.bodyText}>This month’s installment: {money(payrollDraftLoanDeduction(draft, payrollMonth))} · {loanMonthsRemaining(isPositiveInteger(draft.newLoanMonths) ? { ...draft, loanTermMonths: (Number(draft.loanMonthsPaid) || 0) + Number(draft.newLoanMonths) } : draft)} months left</Text>
                <Field label="Remaining repayment months chosen by admin" value={String(draft.newLoanMonths ?? '')} onChangeText={(value) => setDraft({ ...draft, newLoanMonths: value })} keyboardType="numeric" placeholder="e.g. 12" />
              </View> : <>
                <Field label="New admin loan amount" value={String(draft.newLoanAmount ?? '')} onChangeText={(value) => setDraft({ ...draft, newLoanAmount: value })} keyboardType="numeric" placeholder="0" />
                <Field label="Repayment term chosen by admin (months)" value={String(draft.newLoanMonths ?? '')} onChangeText={(value) => setDraft({ ...draft, newLoanMonths: value })} keyboardType="numeric" placeholder="e.g. 12" />
                <Text style={styles.caption}>Enter the admin-selected positive whole-number term. No maximum repayment term is imposed. Record the loan before marking this month’s salary paid.</Text>
                {Number(draft.newLoanAmount) > 0 && isPositiveInteger(draft.newLoanMonths) && <Text style={styles.bodyText}>Estimated monthly installment: {money(payrollDraftLoanDeduction(draft, payrollMonth))}</Text>}
              </>}
              <Text style={styles.fieldLabel}>Payment status</Text><View style={styles.choiceRow}>{['Pending', 'Paid'].map((status) => <Pressable key={status} onPress={() => setDraft({ ...draft, paid: status === 'Paid' })} style={[styles.choice, (!!draft.paid) === (status === 'Paid') && styles.choiceActive]}><Text style={[styles.choiceText, (!!draft.paid) === (status === 'Paid') && styles.choiceTextActive]}>{status}</Text></Pressable>)}</View>
              <PaymentMethodFields
                method={draft.paymentMethod || ''}
                details={draft.paymentDetails || {}}
                amount={payrollDraftAdminNetSalary(draft, payrollMonth)}
                onMethodChange={(paymentMethod) => setDraft({ ...draft, paymentMethod, paymentDetails: { ...(draft.paymentDetails || {}), paymentDate: draft.paymentDetails?.paymentDate || currentDate() } })}
                onDetailsChange={(paymentDetails) => setDraft({ ...draft, paymentDetails })}
              />
              <View style={styles.rowActions}>
                <Button title="Save" small onPress={saveAdminSalary} />
                <Button title="Cancel" variant="outline" small onPress={() => setModal(null)} />
              </View>
            </>}
          </ScrollView>
        </View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.canvas },
  loginPage: { flex: 1, backgroundColor: '#F0EEFF' },
 loginPageScroll: { flex: 1, width: '100%' },
  loginPageContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  loginShell: { width: '100%', maxWidth: 480, backgroundColor: COLORS.white, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, overflow: 'hidden', shadowColor: '#172B4D', shadowOpacity: 0.14, shadowRadius: 32, shadowOffset: { width: 0, height: 14 }, elevation: 7 },
  loginShellWide: { maxWidth: 1080, flexDirection: 'row' },
  loginShowcase: { minHeight: 205, padding: 24, backgroundColor: '#4136B8', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' },
  loginShowcaseWide: { flex: 0.92, minHeight: 570, padding: 46 },
  loginBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 11, zIndex: 1 },
  loginBrandMark: { width: 38, height: 38, borderRadius: 11, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  loginBrandMarkText: { color: COLORS.blue, fontSize: 22, fontWeight: '900' },
  loginBrandTitle: { color: COLORS.white, fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  loginBrandSub: { color: '#D6D1FF', fontSize: 8, fontWeight: '700', letterSpacing: 1.3, marginTop: 2 },
  loginShowcaseCopyBlock: { maxWidth: 390, zIndex: 1 },
  loginShowcaseEyebrow: { color: '#D6D1FF', fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 13 },
  loginShowcaseTitle: { color: COLORS.white, fontSize: 36, lineHeight: 43, fontWeight: '800', letterSpacing: -1 },
  loginShowcaseTitleCompact: { color: COLORS.white, fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },
  loginShowcaseCopy: { color: '#EFEEFF', fontSize: 13, lineHeight: 20, marginTop: 11, maxWidth: 330 },
  loginShowcaseFoot: { flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 1 },
  loginShowcaseDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#61E2C3' },
  loginShowcaseFootText: { color: '#EFEEFF', fontSize: 10, fontWeight: '600' },
  loginShowcaseOrbLarge: { position: 'absolute', width: 250, height: 250, borderRadius: 125, borderWidth: 1, borderColor: 'rgba(189,182,255,0.36)', right: -80, top: -70 },
  loginShowcaseOrbSmall: { position: 'absolute', width: 165, height: 165, borderRadius: 83, backgroundColor: 'rgba(47,218,191,0.22)', right: -50, bottom: -75 },
  loginCard: { width: '100%', padding: 30, backgroundColor: COLORS.white },
  loginCardWide: { flex: 1, padding: 48, justifyContent: 'center' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { color: COLORS.ink, fontSize: 17, fontWeight: '800', letterSpacing: -0.5 },
  brandSub: { color: COLORS.muted, fontSize: 8, fontWeight: '700', letterSpacing: 1.3, marginTop: 1 },
  loginEyebrow: { color: COLORS.blue, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  loginTitle: { color: COLORS.ink, fontSize: 31, fontWeight: '800', marginTop: 10, letterSpacing: -0.9 },
  loginLead: { color: COLORS.muted, fontSize: 14, marginTop: 8, marginBottom: 22 },
  field: { marginBottom: 14 },
  fieldLabel: { color: '#41496E', fontWeight: '700', fontSize: 12, marginBottom: 7 },
  input: { height: 46, borderWidth: 1, borderColor: '#D9DCF1', borderRadius: 10, paddingHorizontal: 13, color: COLORS.ink, fontSize: 14, backgroundColor: COLORS.white },
  inputMultiline: { height: 88, paddingTop: 11, textAlignVertical: 'top' },
  button: { minHeight: 42, paddingHorizontal: 17, borderRadius: 9, backgroundColor: COLORS.blue, alignItems: 'center', justifyContent: 'center', marginTop: 9, flexDirection: 'row' },
  buttonSmall: { minHeight: 34, paddingHorizontal: 12, marginTop: 0, marginRight: 7 },
  button_primary: { backgroundColor: COLORS.blue, shadowColor: COLORS.blue, shadowOpacity: 0.16, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  button_soft: { backgroundColor: COLORS.paleBlue },
  button_outline: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#D5D8F1' },
  button_danger: { backgroundColor: COLORS.paleRed },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { fontWeight: '700', fontSize: 13, color: COLORS.white, letterSpacing: 0.1 },
  buttonTextSmall: { fontSize: 11 },
  buttonText_primary: { color: COLORS.white },
  buttonText_soft: { color: COLORS.blue },
  buttonText_outline: { color: '#536278' },
  buttonText_danger: { color: COLORS.red },
  loginError: { color: COLORS.red, fontSize: 12, marginBottom: 5, backgroundColor: COLORS.paleRed, padding: 10, borderRadius: 8 },
  loginSecurity: { color: COLORS.muted, fontSize: 11, lineHeight: 17, marginTop: 17, textAlign: 'center' },
  prototypeNote: { color: '#8994A5', fontSize: 10, lineHeight: 15, marginTop: 14, textAlign: 'center' },
  sidebar: { width: 248, backgroundColor: COLORS.navy, borderRightWidth: 1, borderRightColor: '#38317D', paddingHorizontal: 18, paddingTop: 25, paddingBottom: 18 },
  sidebarBrandMark: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  sidebarBrandMarkText: { color: COLORS.blue, fontSize: 20, fontWeight: '900' },
  sidebarBrandName: { color: COLORS.white, fontSize: 17, fontWeight: '800', letterSpacing: -0.5 },
  sidebarBrandSub: { color: '#C4C8E8', fontSize: 8, fontWeight: '700', letterSpacing: 1.2, marginTop: 2 },
  navLabel: { color: '#AEB4DE', letterSpacing: 1.3, fontSize: 9, fontWeight: '800', marginTop: 42, marginBottom: 13, paddingLeft: 10 },
  navItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 11, borderRadius: 9, marginBottom: 5 },
  navItemActive: { backgroundColor: '#463DA0' },
  navIcon: { fontSize: 15, width: 25, color: '#B5BBDF', fontWeight: '700' },
  navIconActive: { color: '#B6B9FF' },
  navText: { fontSize: 13, color: '#E0E2F3', fontWeight: '600' },
  navTextActive: { color: COLORS.white, fontWeight: '700' },
  sidebarFoot: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: '#424879', paddingTop: 17, flexDirection: 'row', alignItems: 'center', gap: 8 },
  signedAvatar: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#EAF0FF', alignItems: 'center', justifyContent: 'center' },
  signedAvatarText: { color: COLORS.blue, fontSize: 11, fontWeight: '800' },
  signedName: { color: COLORS.ink, fontSize: 11, fontWeight: '700' },
  signedNameCompact: { fontSize: 10 },
  signedRole: { color: COLORS.muted, fontSize: 10, marginTop: 2 },
  topbarUserDetailsCompact: { maxWidth: 72 },
  signOut: { color: '#C4D0DF', fontSize: 18, paddingHorizontal: 4 },
  main: { flex: 1, minWidth: 0 },
  topbar: { height: 72, paddingHorizontal: 30, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.line, flexDirection: 'row', alignItems: 'center', gap: 14, shadowColor: '#14233B', shadowOpacity: 0.035, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2, zIndex: 1 },
  topbarCompact: { height: 62, paddingHorizontal: 12, gap: 7 },
  topbarDate: { fontSize: 11, color: COLORS.blue, fontWeight: '700', backgroundColor: COLORS.paleBlue, paddingVertical: 7, paddingHorizontal: 10, borderRadius: 7 },
  topbarCompactDate: { fontSize: 10 },
  topbarDivider: { height: 25, width: 1, backgroundColor: COLORS.line },
  userChip: { flexDirection: 'row', gap: 8, alignItems: 'center', minWidth: 0 },
  userChipCompact: { gap: 5 },
  logoutButton: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.line, borderRadius: 8, backgroundColor: COLORS.white },
  logoutButtonCompact: { paddingVertical: 7, paddingHorizontal: 8 },
  logoutText: { fontSize: 11, color: '#475569', fontWeight: '700' },
  mobileNav: { maxHeight: 50, backgroundColor: COLORS.white, borderBottomWidth: 1, borderColor: COLORS.line, flexGrow: 0 },
  mobileNavItem: { paddingVertical: 15, paddingHorizontal: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  mobileNavActive: { borderBottomColor: COLORS.blue, backgroundColor: '#F2F1FF' },
  mobileNavText: { color: COLORS.muted, fontSize: 12, fontWeight: '600' },
  mobileNavTextActive: { color: COLORS.blue },
  contentScroll: { flex: 1 },
  content: { padding: 30, maxWidth: 1540, width: '100%', alignSelf: 'center' },
  contentCompact: { paddingHorizontal: 15, paddingVertical: 21 },
  pageHeading: { marginBottom: 25 },
  pageKicker: { color: COLORS.blue, fontWeight: '800', letterSpacing: 1.35, fontSize: 9, marginBottom: 7 },
  pageTitle: { color: COLORS.ink, fontWeight: '800', fontSize: 26, letterSpacing: -0.7 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 17, gap: 12 },
  sectionTitle: { color: COLORS.ink, fontSize: 17, fontWeight: '700' },
  sectionSubtitle: { color: COLORS.muted, fontSize: 12, marginTop: 5, lineHeight: 18 },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 22 },
  metric: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E0E2F4', borderRadius: 13, padding: 18, flexGrow: 1, flexBasis: 170, minHeight: 126, shadowColor: '#30356A', shadowOpacity: 0.06, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  metric_blue: { backgroundColor: '#F1EFFF', borderColor: '#E1DCFF' },
  metric_green: { backgroundColor: '#EAF9F4', borderColor: '#D6F1E8' },
  metric_amber: { backgroundColor: '#FFF7E8', borderColor: '#F7E8C9' },
  metricMark: { width: 28, height: 4, borderRadius: 2, marginBottom: 13 },
  mark_blue: { backgroundColor: COLORS.blue },
  mark_green: { backgroundColor: COLORS.green },
  mark_amber: { backgroundColor: '#E3A23B' },
  metricLabel: { color: COLORS.muted, fontSize: 9, letterSpacing: 0.75, fontWeight: '800' },
  metricValue: { color: COLORS.ink, fontSize: 25, fontWeight: '800', marginTop: 7 },
  metricDetail: { color: '#7D8AA0', fontSize: 10, marginTop: 5 },
  dashboardColumns: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' },
  panel: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#E0E2F4', borderRadius: 13, padding: 19, marginBottom: 16, shadowColor: '#30356A', shadowOpacity: 0.055, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  growPanel: { flexGrow: 2, flexBasis: 440 },
  dataTable: { width: '100%' },
  tableHeader: { minHeight: 40, backgroundColor: '#F0F0FA', borderRadius: 7, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 11 },
  th: { flex: 1, color: '#666D91', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  tableRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EAF0F5', paddingHorizontal: 10, gap: 11 },
  td: { flex: 1, color: '#536278', fontSize: 11 },
  tdStrong: { flex: 1, color: COLORS.ink, fontSize: 11, fontWeight: '700' },
  tdSmall: { color: '#7D8AA0', fontSize: 9, marginTop: 4 },
  tableCell: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  badge: { alignSelf: 'flex-start', borderRadius: 20, paddingHorizontal: 9, paddingVertical: 5 },
  badge_blue: { backgroundColor: COLORS.paleBlue },
  badge_green: { backgroundColor: COLORS.paleGreen },
  badge_amber: { backgroundColor: COLORS.paleAmber },
  badge_red: { backgroundColor: COLORS.paleRed },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 0.1 },
  badgeText_blue: { color: COLORS.blue },
  badgeText_green: { color: COLORS.green },
  badgeText_amber: { color: COLORS.amber },
  badgeText_red: { color: COLORS.red },
  notice: { backgroundColor: '#F0F0FF', borderLeftWidth: 3, borderLeftColor: COLORS.blue, borderRadius: 10, padding: 16, marginTop: 16 },
  noticeTitle: { color: COLORS.blue, fontSize: 12, fontWeight: '800', marginBottom: 5 },
  noticeText: { color: '#566985', fontSize: 11, lineHeight: 17 },
  adminGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  adminCard: { flexGrow: 1, flexShrink: 1, flexBasis: 340, maxWidth: 520 },
  adminCardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  avatar: { width: 42, height: 42, borderRadius: 13, backgroundColor: COLORS.paleBlue, alignItems: 'center', justifyContent: 'center' },
  avatarLarge: { width: 68, height: 68, borderRadius: 21, backgroundColor: COLORS.paleBlue, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: COLORS.blue, fontSize: 14, fontWeight: '800' },
  cardTitle: { color: COLORS.ink, fontSize: 14, fontWeight: '700' },
  cardSub: { color: COLORS.muted, fontSize: 10, marginTop: 4 },
  contactText: { color: '#536278', fontSize: 11, marginBottom: 6 },
  detailStrip: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: COLORS.line, marginTop: 14, paddingVertical: 11 },
  detailLabel: { color: '#8792A2', fontSize: 9, fontWeight: '800', letterSpacing: 0.6 },
  teamLabel: { color: '#929DAE', fontSize: 8, fontWeight: '800', letterSpacing: 0.7, marginTop: 13, marginBottom: 5 },
  teamNames: { color: '#536177', fontSize: 10, lineHeight: 16 },
  rowActions: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 15, gap: 6 },
  bodyText: { color: '#5F6F85', fontSize: 12, lineHeight: 18, marginTop: 6 },
  searchInput: { height: 44, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 10, paddingHorizontal: 14, marginBottom: 16, color: COLORS.ink, fontSize: 12 },
  caption: { color: '#7D8AA0', fontSize: 10, lineHeight: 16, marginTop: 13 },
  empty: { padding: 26, alignItems: 'center' },
  emptyText: { color: '#8995A7', fontSize: 12 },
  adminSalaryRow: { minHeight: 58, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#EAF0F5', gap: 14 },
  adminSalaryRowWrap: { flexWrap: 'wrap', paddingVertical: 8 },
  adminSalaryActions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 5 },
  calculatedNet: { color: COLORS.blue, fontSize: 13, fontWeight: '800', marginVertical: 12, backgroundColor: COLORS.paleBlue, padding: 12, borderRadius: 9 },
  profileCard: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 14, alignItems: 'center', padding: 32, maxWidth: 520, shadowColor: '#14233B', shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 1 },
  profileName: { color: COLORS.ink, fontSize: 19, fontWeight: '800' },
  profileDetails: { borderTopWidth: 1, borderColor: COLORS.line, marginTop: 20, paddingTop: 15, width: '100%', gap: 6 },
  auditLine: { flexDirection: 'row', gap: 12, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EAF0F5' },
  auditDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.blue, marginTop: 4 },
  auditMessage: { color: COLORS.ink, fontSize: 11, fontWeight: '600', lineHeight: 16 },
  auditMeta: { color: '#8A96A7', fontSize: 9, marginTop: 4 },
  footerText: { color: '#8996A9', fontSize: 8, letterSpacing: 1, marginTop: 24, marginBottom: 8 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(17,29,49,0.54)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 540, maxHeight: '91%', backgroundColor: COLORS.white, borderRadius: 16, padding: 24, shadowColor: '#14233B', shadowOpacity: 0.18, shadowRadius: 26, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 13, borderBottomWidth: 1, borderColor: COLORS.line },
  modalTitle: { color: COLORS.ink, fontSize: 18, fontWeight: '800' },
  closeText: { color: COLORS.muted, fontSize: 18, paddingHorizontal: 5 },
  checkRow: { minHeight: 38, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, borderColor: '#F1F3F7' },
  checkBox: { width: 17, height: 17, borderWidth: 1, borderColor: '#C7D0DE', borderRadius: 4, textAlign: 'center', color: COLORS.white, fontSize: 11, overflow: 'hidden' },
  checkBoxOn: { backgroundColor: COLORS.blue, borderColor: COLORS.blue },
  checkLabel: { color: '#536177', fontSize: 11 },
  disabledText: { color: '#AAB3C0' },
  choiceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 11 },
  choice: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D7E0EC', backgroundColor: COLORS.white },
  choiceActive: { backgroundColor: COLORS.paleBlue, borderColor: '#AFC2FF' },
  choiceText: { color: '#5F6F85', fontSize: 10, fontWeight: '600' },
  choiceTextActive: { color: COLORS.blue },
  calendarHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 8 },
  calendarMonth: { color: COLORS.ink, fontSize: 14, fontWeight: '700' },
  calendarWeek: { flexDirection: 'row' },
  calendarWeekday: { flex: 1, textAlign: 'center', color: COLORS.muted, fontSize: 9, fontWeight: '700', paddingVertical: 6 },
  calendarDay: { flex: 1, minHeight: 76, borderWidth: 1, borderColor: COLORS.line, padding: 3, backgroundColor: COLORS.white },
  calendarBlank: { backgroundColor: '#F8F9FC' },
  calendarHoliday: { backgroundColor: '#FFF7E8' },
  calendarPublicEvent: { backgroundColor: '#F1EFFF' },
  calendarSelected: { borderColor: COLORS.blue, borderWidth: 2 },
  calendarDayNumber: { color: COLORS.ink, fontSize: 10, fontWeight: '800', marginBottom: 2 },
  calendarHolidayText: { color: COLORS.amber, fontSize: 7, lineHeight: 9, fontWeight: '700' },
  calendarEventText: { color: COLORS.blue, fontSize: 7, lineHeight: 9, fontWeight: '700' },
  calendarStatusText: { color: COLORS.green, fontSize: 7, lineHeight: 9, fontWeight: '700' },
  calendarLeaveText: { color: COLORS.red, fontSize: 7, lineHeight: 9, fontWeight: '700' },
  calendarNoRecord: { color: '#8995A7', fontSize: 7, lineHeight: 9 },
  calendarLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 9 },
  calendarLegendText: { color: COLORS.muted, fontSize: 9 },
  publicEventRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderTopWidth: 1, borderColor: COLORS.line, paddingVertical: 6 },
  detailBlock: { borderBottomWidth: 1, borderColor: COLORS.line, paddingBottom: 13, marginBottom: 13 },
});

export default App;
