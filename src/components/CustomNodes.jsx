import clsx from "clsx";
import { Database, Globe, Layers, Server, Smartphone } from "lucide-react";
import { memo } from "react";
import { Handle, Position } from "reactflow";

const BaseNode = ({ data, icon: Icon, colorClass, isSelected }) => {
  return (
    <div
      className={clsx(
        "px-4 py-3 shadow-lg rounded-xl border-2 min-w-[180px] transition-all duration-200",
        colorClass
      )}
      style={{
        backgroundColor: "var(--node-bg)",
        borderColor: isSelected ? "var(--accent-blue)" : "var(--node-border)",
        boxShadow: isSelected ? "var(--accent-blue-glow)" : "var(--shadow-lg)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3"
        style={{ backgroundColor: "var(--text-muted)" }}
      />

      <div className="flex items-center gap-3">
        <div
          className={clsx(
            "p-2 rounded-lg bg-opacity-20",
            colorClass.replace("border-", "bg-").replace("text-", "text-")
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {data.label}
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {data.tech}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3"
        style={{ backgroundColor: "var(--text-muted)" }}
      />
    </div>
  );
};

export const DatabaseNode = memo(({ data, selected }) => (
  <BaseNode
    data={data}
    icon={Database}
    colorClass="border-emerald-500/50 text-emerald-400"
    isSelected={selected}
  />
));

export const ServerNode = memo(({ data, selected }) => (
  <BaseNode
    data={data}
    icon={Server}
    colorClass="border-blue-500/50 text-blue-400"
    isSelected={selected}
  />
));

export const ClientNode = memo(({ data, selected }) => (
  <BaseNode
    data={data}
    icon={Smartphone}
    colorClass="border-purple-500/50 text-purple-400"
    isSelected={selected}
  />
));

export const LoadBalancerNode = memo(({ data, selected }) => (
  <BaseNode
    data={data}
    icon={Globe}
    colorClass="border-orange-500/50 text-orange-400"
    isSelected={selected}
  />
));

export const CacheNode = memo(({ data, selected }) => (
  <BaseNode
    data={data}
    icon={Layers}
    colorClass="border-yellow-500/50 text-yellow-400"
    isSelected={selected}
  />
));
