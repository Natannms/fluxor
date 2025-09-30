"use client";

export default function DashboardHome() {
  return (
    <div className="px-8 py-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <div className="text-gray-500 font-medium text-sm">October 19, 2021</div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by date, name or ID..."
              className="pl-4 pr-10 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 w-80 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </button>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            ⚙️
          </button>
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">JD</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Clients ♂</h2>
        <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider">
          Details
        </span>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Card: User Profile */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center border border-gray-100">
          <div className="w-20 h-20 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-2xl flex items-center justify-center mb-4 relative">
            <div className="w-16 h-16 bg-orange-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👨‍💼</span>
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs">📄</span>
            </div>
          </div>
          <div className="text-lg font-bold text-gray-800 mb-1">John Doe</div>
          <div className="text-gray-500 text-sm mb-2">saikatkr034@gmail.com</div>
          <div className="text-gray-400 text-xs mb-4">+88 0179 408 805</div>
          <div className="flex gap-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-medium">
              Email
            </button>
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-xs font-medium">
              Text
            </button>
          </div>
        </div>

        {/* Card: Geographics */}
        <div className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100">
          <div className="font-bold text-gray-800 mb-4 text-lg">Geographics</div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📞</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-800 text-sm font-medium">Contact</div>
                <div className="text-gray-500 text-xs">+88 0179 408 805</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📍</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-800 text-sm font-medium">Address</div>
                <div className="text-gray-500 text-xs">123 Street, New York</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">📅</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="text-gray-800 text-sm font-medium">Last Visit</div>
                <div className="text-gray-500 text-xs">February 24, 2021</div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-400 text-xs">🔄</span>
              </div>
              <div className="text-gray-800 text-sm font-medium">Repeated Client</div>
            </div>
          </div>
        </div>

        {/* Card: Orders */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <div>
            <div className="font-bold text-gray-800 mb-3 text-lg">Orders</div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              50 
              <span className="text-sm font-normal text-gray-500 ml-2">(Total)</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xs">↗</span>
            </div>
            <span>Impression Increased</span>
          </div>
        </div>

        {/* Card: Order Cost */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col justify-between border border-gray-100">
          <div>
            <div className="font-bold text-gray-800 mb-3 text-lg">Order Cost</div>
            <div className="text-4xl font-bold text-gray-800 mb-2">
              2500 
              <span className="text-sm font-normal text-gray-500 ml-2">USD</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-orange-600 text-sm font-medium">
            <div className="w-5 h-5 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-xs">↘</span>
            </div>
            <span>Impression Decreased</span>
          </div>
        </div>
      </div>

      {/* Tabs and Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="px-6 pt-6">
          <div className="flex gap-8 border-b border-gray-100">
            <button className="pb-3 border-b-2 border-blue-600 text-blue-600 font-semibold text-sm">
              All Orders
            </button>
            <button className="pb-3 text-gray-500 font-medium text-sm hover:text-gray-700">
              Pending Orders
            </button>
            <button className="pb-3 text-gray-500 font-medium text-sm hover:text-gray-700">
              Delivered Orders
            </button>
            <button className="pb-3 text-gray-500 font-medium text-sm hover:text-gray-700">
              Booked Orders
            </button>
            <button className="pb-3 text-gray-500 font-medium text-sm hover:text-gray-700">
              Cancelled Orders
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-50 rounded-xl">
                  <th className="py-4 px-6 text-left text-blue-600 font-semibold text-sm rounded-l-xl">
                    Order ID
                  </th>
                  <th className="py-4 px-6 text-left text-blue-600 font-semibold text-sm">
                    Ordered Date
                  </th>
                  <th className="py-4 px-6 text-left text-blue-600 font-semibold text-sm">
                    Product Name
                  </th>
                  <th className="py-4 px-6 text-left text-blue-600 font-semibold text-sm">
                    Product Price
                  </th>
                  <th className="py-4 px-6 text-left text-blue-600 font-semibold text-sm rounded-r-xl">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-gray-50">
                  <td className="py-4 px-6 text-gray-800 font-medium text-sm">#123245</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">14-12-2020</td>
                  <td className="py-4 px-6 text-gray-800 text-sm">Decorative box</td>
                  <td className="py-4 px-6 text-gray-800 font-medium text-sm">120 USD</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 text-sm font-medium">Delivered</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-800 font-medium text-sm">#678457</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">13-12-2020</td>
                  <td className="py-4 px-6 text-gray-800 text-sm">Plantation box</td>
                  <td className="py-4 px-6 text-gray-800 font-medium text-sm">120 USD</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-700 text-sm font-medium">Cancelled</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}