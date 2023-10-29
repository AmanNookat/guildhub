"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@radix-ui/react-dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const data: User[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@yahoo.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@gmail.com",
  },
];

export type User = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const columns: ColumnDef<User>[] = [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Username",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <div className="text-center">Role</div>;
    },
    cell: ({ row }) => (
      <div className="lowercase text-center">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return <div className="text-center">{amount}</div>;
    },
  },
];

export function MembersTableModal() {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type } = useModal();
  const [loadingId, setLoadingId] = React.useState("");

  const isModalOpen = isOpen && type === "membersTable";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="w-1/2 ml-96">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import axios from "axios";
// import qs from "query-string";
// import {
//   Check,
//   Gavel,
//   Loader2,
//   MoreVertical,
//   Shield,
//   ShieldAlert,
//   ShieldCheck,
//   ShieldQuestion,
// } from "lucide-react";
// import { useState } from "react";
// import { MemberRole } from "@prisma/client";
// import { useRouter } from "next/navigation";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { useModal } from "@/hooks/use-modal-store";
// import { ServerWithMembersWithProfiles } from "@/types";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { UserAvatar } from "@/components/user-avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuPortal,
//   DropdownMenuSeparator,
//   DropdownMenuSub,
//   DropdownMenuSubContent,
//   DropdownMenuTrigger,
//   DropdownMenuSubTrigger,
// } from "@/components/ui/dropdown-menu";

// // ---------------------

// import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// const roleIconMap = {
//   GUEST: null,
//   MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
//   ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
// };

// export const MembersTableModal = () => {
//   const router = useRouter();
//   const { onOpen, isOpen, onClose, type, data } = useModal();
//   const [loadingId, setLoadingId] = useState("");

//   const isModalOpen = isOpen && type === "membersTable";
//   const { server } = data as { server: ServerWithMembersWithProfiles };

//   const onKick = async (memberId: string) => {
//     try {
//       setLoadingId(memberId);
//       const url = qs.stringifyUrl({
//         url: `/api/members/${memberId}`,
//         query: {
//           serverId: server?.id,
//         },
//       });

//       const response = await axios.delete(url);

//       router.refresh();
//       onOpen("members", { server: response.data });
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoadingId("");
//     }
//   };

//   const onRoleChange = async (memberId: string, role: MemberRole) => {
//     try {
//       setLoadingId(memberId);
//       const url = qs.stringifyUrl({
//         url: `/api/members/${memberId}`,
//         query: {
//           serverId: server?.id,
//         },
//       });

//       const response = await axios.patch(url, { role });

//       router.refresh();
//       onOpen("members", { server: response.data });
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoadingId("");
//     }
//   };
//   return (
//     <Dialog open={isModalOpen} onOpenChange={onClose}>
//       <DialogContent className="bg-white text-black overflow-hidden">
//         <DialogHeader className="pt-8 px-6">
//           <DialogTitle className="text-2xl text-center font-bold">
//             Members List
//           </DialogTitle>
//         </DialogHeader>
//         <div className="mt-8">
//           {server?.members?.map((member) => (
//             <div key={member.id} className="flex items-center gap-x-2 mb-6">
//               <UserAvatar src={member.profile.imageUrl} />
//               <div className="flex flex-col gap-y-1">
//                 <div className="text-xs font-semibold flex items-center gap-x-1">
//                   {member.profile.name}
//                   {roleIconMap[member.role]}
//                 </div>
//                 <p className="text-xs text-zinc-500">{member.profile.email}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };
