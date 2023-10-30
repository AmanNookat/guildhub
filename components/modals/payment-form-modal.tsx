"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";

import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";

export const PaymentFormModal = () => {
  const { isOpen, onClose, type } = useModal();

  const isModalOpen = isOpen && type === "paymentForm";

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const handleInputChange = (evt: any) => {
    const { name, value } = evt.target;

    let newValue = value;
    if (name === "number" || name === "cvc") {
      newValue = value.replace(/\D/g, "");
    }

    if (name === "expiry") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setState((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleInputFocus = (evt: any) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-5 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="my-5">Buy GuildHub Premium</DialogTitle>
          <Cards
            number={state.number}
            expiry={state.expiry}
            cvc={state.cvc}
            name={state.name}
          />
        </DialogHeader>

        <div className="flex flex-col w-full items-center text-white gap-3">
          <Input
            type="text"
            name="number"
            placeholder="Card number"
            value={state.number}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            maxLength={16}
          />
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={state.name}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
          <Input
            type="text"
            name="expiry"
            placeholder="Validity (mm/yy)"
            value={state.expiry}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            maxLength={4}
          />
          <Input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={state.cvc}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            maxLength={3}
          />
          <Button onClick={onClose} variant="outline">
            Buy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
