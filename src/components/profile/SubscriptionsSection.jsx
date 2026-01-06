import React, { useEffect, useMemo, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const SubscriptionsSection = () => {
  const [memberships, setMemberships] = useState([]);

  const [userMemberships, setUserMemberships] = useState([]);
  const [userMembershipsError, setUserMembershipsError] = useState(false);
  const [loadingUserMemberships, setLoadingUserMemberships] = useState(true);

  const [activeDetailsId, setActiveDetailsId] = useState(null);
  const [membershipDetails, setMembershipDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [catalogError, setCatalogError] = useState(false);

  /* ----------------------------------------
     Utilities
  ---------------------------------------- */

  const formatBenefitType = (value = '') =>
    value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

  /* ----------------------------------------
     Fetch catalog (authoritative)
  ---------------------------------------- */

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoadingCatalog(true);
      setCatalogError(false);

      try {
        const res = await axiosInstance.get('/memberships', {
          timeout: 15000,
        });
        setMemberships(res.data || []);
      } catch (err) {
        console.error('Failed to load memberships catalog:', err);
        setCatalogError(true);
      } finally {
        setLoadingCatalog(false);
      }
    };

    fetchCatalog();
  }, []);

  /* ----------------------------------------
     Fetch user memberships (non-blocking)
  ---------------------------------------- */

  useEffect(() => {
    const fetchUserMemberships = async () => {
      setLoadingUserMemberships(true);
      setUserMembershipsError(false);

      try {
        const res = await axiosInstance.get('/memberships/me', {
          timeout: 15000,
        });
        setUserMemberships(res.data || []);
      } catch (err) {
        console.warn('User memberships unavailable:', err);
        setUserMemberships([]);
        setUserMembershipsError(true);
      } finally {
        setLoadingUserMemberships(false);
      }
    };

    fetchUserMemberships();
  }, []);

  /* ----------------------------------------
     Domain reconciliation (defensive)
  ---------------------------------------- */

  const joinedMembershipIds = useMemo(() => {
    if (userMembershipsError || !Array.isArray(userMemberships)) {
      return new Set();
    }
    return new Set(userMemberships.map(um => um.membership_type_id));
  }, [userMemberships, userMembershipsError]);

  const availableMemberships = useMemo(
    () => memberships.filter(m => !joinedMembershipIds.has(m.id)),
    [memberships, joinedMembershipIds]
  );

  const joinedMemberships = useMemo(
    () => memberships.filter(m => joinedMembershipIds.has(m.id)),
    [memberships, joinedMembershipIds]
  );

  /* ----------------------------------------
     Membership details (on-demand)
  ---------------------------------------- */

  const toggleMembershipDetails = async (id) => {
    if (activeDetailsId === id) {
      setActiveDetailsId(null);
      setMembershipDetails(null);
      return;
    }

    setActiveDetailsId(id);
    setLoadingDetails(true);

    try {
      const res = await axiosInstance.get(`/memberships/${id}`, {
        timeout: 15000,
      });
      setMembershipDetails(res.data);
    } catch (err) {
      console.error('Failed to load membership details:', err);
      setMembershipDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  /* ----------------------------------------
     Loading gate (catalog only)
  ---------------------------------------- */

  if (loadingCatalog) {
    return (
      <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center min-h-[50dvh] w-full bg-white rounded-lg border border-gray-200 mt-4">
        <div className="loader"></div>
        <p className="text-center text-gray-400">
          Loading memberships...
        </p>
      </div>
    );
  }

  /* ----------------------------------------
     Render
  ---------------------------------------- */

  return (
    <div className="w-full bg-white rounded-sm border border-gray-200 mt-4">
      <div>

        {/* ===============================
            MEMBERSHIP CATALOG (ALWAYS)
        =============================== */}

        <div className="px-6 py-4">
          <h4 className="capitalize">Subcriptions and Memberships</h4>

          <div className="my-4 px-4">
            <p className="text-xs my-4 font-medium text-gray-500">
              Available memberships to Join
            </p>

            {availableMemberships.map(m => (
              <div
                key={m.id}
                className="cursor-default hover:shadow-sm px-4 py-2 rounded-sm border border-gray-100 hover:border-gray-200 text-gray-600"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h4>{m.name}</h4>
                    <p className="text-sm">{m.description}</p>
                  </div>
                  <button className="btn-primary-outlined-sm">
                    Join
                  </button>
                </div>

                <p
                  className="text-sm text-(--color-primary) border-b border-transparent hover:border-(--color-primary) w-fit cursor-pointer my-1"
                  onClick={() => toggleMembershipDetails(m.id)}
                >
                  {activeDetailsId === m.id
                    ? 'Hide Benefits'
                    : 'Show Benefits'}
                </p>

                {activeDetailsId === m.id && (
                  loadingDetails ? (
                    <div className="px-6 md:px-36 py-12 flex flex-col gap-4 items-center justify-center w-full bg-white rounded-sm mt-4">
                      <div className="loader"></div>
                      <p className="text-center text-gray-400">
                        Loading details...
                      </p>
                    </div>
                  ) : membershipDetails?.benefits?.length ? (
                    <div>
                      {membershipDetails.benefits.map(b => (
                        <p key={b.id} className=" bg-gray-50 w-full py-4 border-y border-gray-100">
                          {formatBenefitType(b.benefit_type)} {b.value && (
                            <span>- {Number(b.value)}%</span>
                          )}
                        </p>
                      ))}
                    </div>
                  ) : null
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ===============================
            USER MEMBERSHIPS (OPTIONAL)
        =============================== */}

        <div className="px-6 py-4 border-t border-gray-100">
          <p className="text-xs my-4 font-medium text-gray-500">
            Your active memberships
          </p>

          {loadingUserMemberships && (
            <p className="text-sm text-gray-400">
              Loading your memberships...
            </p>
          )}

          {userMembershipsError && (
            <p className="text-sm text-(--color-warning)">
              Unable to load your memberships at this time.
            </p>
          )}

          {!loadingUserMemberships && !userMembershipsError && joinedMemberships.map(m => (
            <div
              key={m.id}
              className="px-4 py-2 rounded-sm border border-gray-100 text-gray-600"
            >
              <h4>{m.name}</h4>
              <p className="text-sm">{m.description}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SubscriptionsSection;
