// src/pages/UsersPage.tsx

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Search, AlertTriangle, Trash2 } from "lucide-react";
import debounce from "lodash/debounce";
import Table, { type Column } from "@/components/ui/Table";
import Button from "@/components/ui/Button";
import {
  getAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  type User,
} from "@/api/userService";
import UserDetailsModal from "@/components/Users/UserDetailsModal";
import BlockUserModal from "@/components/Users/BlockConfirmModal";
import DeleteUserModal from "@/components/Users/DeleteConfirmModal";

export const UsersPage: React.FC = () => {
  // ─────────────────────────────────────
  // State
  // ─────────────────────────────────────
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [showBlocked, setShowBlocked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [detailsModalUserId, setDetailsModalUserId] = useState<string | null>(
    null
  );
  const [blockModalUserId, setBlockModalUserId] = useState<string | null>(
    null
  );
  const [deleteModalUserId, setDeleteModalUserId] = useState<string | null>(
    null
  );

  const searchRef = useRef<HTMLDivElement>(null);

  // ─────────────────────────────────────
  // Debounced search logic (500ms)
  // ─────────────────────────────────────
  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearchTerm(val);
        setPage(1);
      }, 500),
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchInput(val);
      debouncedSetSearch(val);
    },
    [debouncedSetSearch]
  );

  // ─────────────────────────────────────
  // Fetch users whenever page, searchTerm, or showBlocked changes
  // ─────────────────────────────────────
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const { rows, totalCount } = await getAllUsers({
          page,
          limit: 10,
          search: searchTerm || undefined,
          blockedOnly: showBlocked,
        });
        setUsers(rows);
        setTotalCount(totalCount);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, searchTerm, showBlocked]);

  // ─────────────────────────────────────
  // Column definitions:
  //    - First column is always a fixed-width “icon placeholder” (4vw).
  //    - Next columns (User ID, Name, Email, Mobile, Info).
  //    - Last column “Action” is 8vw.
  // ─────────────────────────────────────

  // 1) First column: either AlertTriangle (Active + policyViolated) or blank (Blocked)
  const placeholderColumn: Column<User> = {
    header: "",
    accessor: "policyViolated",
    width: "w-[2vw]",
    cell: (row) =>
      !showBlocked && row.policyViolated ? (
        <button
          className="p-1 text-red-600 hover:text-red-800 relative "
          onClick={() => {
            setBlockModalUserId(row.userId);
          }}
        >
          <AlertTriangle size={18} className=""/>
        </button>
      ) : null,
    className: "text-left w-[2vw]  ",
  };

  // 2) Common columns for both Active & Blocked
  const userIdColumn: Column<User> = {
    header: "User ID",
    accessor: "userId",
    width: "w-[8vw]",
  };
  const nameColumn: Column<User> = {
    header: "Name",
    accessor: "name",
    width: "w-[12vw]",
  };
  const emailColumn: Column<User> = {
    header: "Email",
    accessor: "email",
    width: "w-[16vw]",
  };
  const mobileColumn: Column<User> = {
    header: "Mobile Number",
    accessor: "mobileNumber",
    width: "w-[12vw]",
  };
  const infoColumn: Column<User> = {
    header: "Info",
    accessor: "userId",
    width: "w-[8vw]",
    cell: (row) => (
      <button
        onClick={() => setDetailsModalUserId(row.userId)}
        className="text-primary underline text-sm"
      >
        View Details
      </button>
    ),
    className: "text-center",
  };

  // 3a) Action column for Active Users (“Delete”)
  const activeActionColumn: Column<User> = {
    header: "Action",
    accessor: "userId",
    width: "w-[8vw]",
    cell: (row) => (
      <button
        onClick={() => setDeleteModalUserId(row.userId)}
        className="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        <Trash2 size={16}/>
      </button>
    ),
    className: "text-center",
  };

  // 3b) Action column for Blocked Users (“Unblock User”)
  const blockedActionColumn: Column<User> = {
    header: "Action",
    accessor: "userId",
    width: "w-[8vw]",
    cell: (row) => (
      <Button
        variant="successSolid"
        onClick={() => setBlockModalUserId(row.userId)}
      >
        Unblock User
      </Button>
    ),
    className: "text-left",
  };

  // 4) Combine into two full sets of columns
  const activeColumns: Column<User>[] = [
    placeholderColumn,
    userIdColumn,
    nameColumn,
    emailColumn,
    mobileColumn,
    infoColumn,
    activeActionColumn,
  ];

  const blockedColumns: Column<User>[] = [
    placeholderColumn,
    userIdColumn,
    nameColumn,
    emailColumn,
    mobileColumn,
    infoColumn,
    blockedActionColumn,
  ];

  // ─────────────────────────────────────
  // Handle block/unblock and then refresh table
  // ─────────────────────────────────────
  const handleBlockConfirm = async (uid: string) => {
    setLoading(true);
    try {
      if (showBlocked) {
        // If currently viewing blocked users, this is “Unblock”
        await unblockUser(uid);
      } else {
        // If in active view, this is “Block”
        await blockUser(uid);
      }
      setBlockModalUserId(null);

      // Re‐fetch same page
      const { rows, totalCount } = await getAllUsers({
        page,
        limit: 10,
        search: searchTerm || undefined,
        blockedOnly: showBlocked,
      });
      setUsers(rows);
      setTotalCount(totalCount);
    } catch (err) {
      console.error("Error blocking/unblocking user:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────
  // Handle delete and then refresh table
  // ─────────────────────────────────────
  const handleDeleteConfirm = async (uid: string) => {
    setLoading(true);
    try {
      await deleteUser(uid);
      setDeleteModalUserId(null);

      // Re‐fetch same page
      const { rows, totalCount } = await getAllUsers({
        page,
        limit: 10,
        search: searchTerm || undefined,
        blockedOnly: showBlocked,
      });
      setUsers(rows);
      setTotalCount(totalCount);
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      {/* 1) Header: Title + Toggle Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-primary">Users</h1>
        <Button
          variant="primaryHorizontalGradient"
          onClick={() => {
            setShowBlocked((prev) => !prev);
            setPage(1);
          }}
        >
          {showBlocked ? "Show Active Users" : "Blocked Users"}
        </Button>
      </div>

      {/* 2) Info Row: Count & Search */}
      <div className="flex items-center justify-between">
        <div className="text-secondary text-lg font-semibold">
          {showBlocked
            ? `Blocked Users: ${totalCount}`
            : `Active Users: ${totalCount}`}
        </div>

        {/* Search Box */}
        <div className="flex items-center space-x-2 w-64" ref={searchRef}>
          <div className="flex items-center space-x-1 bg-white rounded-md px-2 py-1 w-full">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search User"
              value={searchInput}
              onChange={handleSearchChange}
              className="flex-grow text-sm text-primary focus:outline-none bg-transparent"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* 3) Main Table */}
      <div className="bg-surface rounded-xl p-6">
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {loading ? (
          <p className="text-primary text-center py-12">Loading…</p>
        ) : users.length > 0 ? (
          <Table
            columns={showBlocked ? blockedColumns : activeColumns}
            data={users}
            className="border-separate"
            pagination={{
              currentPage: page,
              totalPages: Math.ceil(totalCount / 10),
              onPageChange: (newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: "smooth" });
              },
            }}
            // Highlight “policy‐violated” rows only in Active Users view
            rowClassName={(row) =>
              !showBlocked && row.policyViolated ? "bg-red-100 rounded-lg" : ""
            }
          />
        ) : (
          <p className="text-center text-muted py-12">
            No users {showBlocked ? "blocked" : "found"}.
          </p>
        )}
      </div>

      {/* 4) User Details Modal */}
      {detailsModalUserId && (
        <UserDetailsModal
          userId={detailsModalUserId}
          onClose={() => setDetailsModalUserId(null)}
        />
      )}

      {/* 5) Block / Unblock Modal */}
      {blockModalUserId && (
        <BlockUserModal
          userId={blockModalUserId}
          onClose={() => setBlockModalUserId(null)}
          onBlock={handleBlockConfirm}
        />
      )}

      {/* 6) Delete Modal */}
      {deleteModalUserId && (
        <DeleteUserModal
          userId={deleteModalUserId}
          onClose={() => setDeleteModalUserId(null)}
          onConfirm={() => handleDeleteConfirm(deleteModalUserId)}
        />
      )}
    </div>
  );
};

export default UsersPage;
