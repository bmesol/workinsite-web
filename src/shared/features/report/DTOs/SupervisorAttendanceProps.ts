// import type { User } from '@/shared/features/users/DTOs/User';

// export type CurrentLocation = {
//     lat: number;
//     lng: number;
//     address: string;
// };

// export type SupervisorAttendance = {
//     id: number;
//     date: string;
//     supervisor: User[];
//     currentLocation: CurrentLocation;
// };

// export type SupervisorAttendanceCreationRequest = {
//     date: string;
//     supervisorId: number;
//     currentLocation: CurrentLocation;
// };

// export type SupervisorAttendanceListResponse = {
//     totalCount: number;
//     pageNumber: number;
//     pageSize: number;
//     totalPages: number;
//     items: SupervisorAttendance[];
// };

// export type SupervisorAttendanceListParams = {
//     SupervisorId?: number;
//     FromDate?: string;   // changed from Date
//     ToDate?: string;     // new
//     PageNumber?: number;
//     PageSize?: number;
//     IgnorePagination?: boolean;
// };


import type { User } from '@/shared/features/users/DTOs/User';

export type CurrentLocation = {
    lat: number;
    lng: number;
    address: string;
};

// Minimal site shape returned inside an attendance record.
// If you have a shared Site DTO, you can import and use that instead.
export type AttendanceSite = {
    id: number;
    name: string;
    status?: string;
};

export type SupervisorAttendance = {
    id: number;
    date: string;
    supervisor: User[];
    site?: AttendanceSite;              // ← NEW: which site this check-in belongs to
    currentLocation: CurrentLocation;
};

export type SupervisorAttendanceCreationRequest = {
    date: string;
    time?: string;
    siteId: number;
    supervisorId: number;
    currentLocation: CurrentLocation;
};

export type SupervisorAttendanceListResponse = {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    items: SupervisorAttendance[];
};

export type SupervisorAttendanceListParams = {
    SupervisorId?: number;
    FromDate?: string;   // changed from Date
    ToDate?: string;     // new
    PageNumber?: number;
    PageSize?: number;
    IgnorePagination?: boolean;
};