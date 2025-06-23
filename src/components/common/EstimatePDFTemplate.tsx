// src / components / common / EstimatePDFTemplate.tsx;
import React from "react";
import type { EstimatePDFData } from "../../types/common/pdf/page";

interface EstimatePDFTemplateProps {
  data: EstimatePDFData;
  className?: string;
}

const EstimatePDFTemplate: React.FC<EstimatePDFTemplateProps> = ({ data, className = "" }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatNumber = (num: number) => num.toLocaleString();

  const documentType = data.document_type || "estimate";
  const documentLabel = documentType === "estimate" ? "見積書" : documentType === "invoice" ? "請求書" : documentType === "order" ? "注文書" : "見積書";

  // 特約条項コンポーネント（注文書専用）
  const SpecialTermsPage = () => (
    <div
      className="order-terms-page bg-white p-8 max-w-7xl mx-auto"
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        pageBreakBefore: "always",
        breakBefore: "page",
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-6 border-b-2 border-black pb-2">特約条項</h1>
      </div>

      {/* 特約条項内容 */}
      <div className="space-y-4 text-sm leading-relaxed">
        {/* 1. 申込金の性格と充当 */}
        <div>
          <h3 className="font-bold mb-2">1. (申込金の性格と充当)</h3>
          <div className="ml-4 space-y-1">
            <p>1. 注文者は販売会社に対し注文と同時に申込金を支払うものとします。</p>
            <p>2. 申込金は手付金ではありません。</p>
            <p>3. 申込金は契約成立後に、売買代金の一部に充当されるものとします。</p>
          </div>
        </div>

        {/* 2. 注文に応じられない場合 */}
        <div>
          <h3 className="font-bold mb-2">2. (注文に応じられない場合)</h3>
          <p className="ml-4">
            この注文書における販売会社(以下、販売会社)がこの注文に応じられない場合、この契約を解除されてもこの注文書における注文者(以下、注文者)は一切異議のないものとします。この場合、申込金はそのまま注文者に返還されるものとします。
          </p>
        </div>

        {/* 3. 申込みの撤回又は契約の解除による損害賠償 */}
        <div>
          <h3 className="font-bold mb-2">3. (申込みの撤回又は契約の解除による損害賠償)</h3>
          <p className="ml-4">
            注文者の都合により申込みを撤回した場合又は契約の解除をした場合、注文者は販売会社に対し当該車輛本体価格の2割相当額を損害賠償金として請求されても異議のないものとします。この場合申込金と対等額で相殺されても異議のないものとします。又申込み後販売会社の指定のない場合において、一ヶ月以内に全額支払えない場合には、販売会社において申込みの撤回の手続きをとられても異議のないものとします。
          </p>
        </div>

        {/* 4. 契約の成立時期 */}
        <div>
          <h3 className="font-bold mb-2">4. (契約の成立時期)</h3>
          <p className="ml-4">この注文書による契約の成立は、申込金を支払った日又は注文書交付日のいずれか早い方とします。</p>
        </div>

        {/* 5. 支払について */}
        <div>
          <h3 className="font-bold mb-2">5. (支払について)</h3>
          <p className="ml-4">注文者は頭金を契約成立日に、残金を販売会社の定めた支払期日に従い納車日までにその全額を販売会社に支払うものとします。</p>
        </div>

        {/* 6. 所有権移転の時期について */}
        <div>
          <h3 className="font-bold mb-2">6. (所有権移転の時期について)</h3>
          <p className="ml-4">当該車輛の所有権移転手続きの時期は売買代金完済時とします。</p>
        </div>

        {/* 7. 下取車の性格・担保責任・再査定 */}
        <div>
          <h3 className="font-bold mb-2">7. (下取車の性格・担保責任・再査定)</h3>
          <p className="ml-4">
            注文者は下取自動車を売買代金の一部の支払いの為、代物弁済として販売会社に引渡します。従って下取自動車について差押、公租公課の滞納等一切の負担のないこと及び走行距離改竄等のないことを保証し、万一負担もしくはメーター改竄等がある場合は注文者の責任において処理することとします。又当該下取自動車が、販売会社に引渡すまでの間に、状態に変化が生じた場合は、再査定された価格をもって下取価格とされても異議のないものとします。
          </p>
        </div>

        {/* 8. 下取自動車の賠償責任保険料及び自動車税 */}
        <div>
          <h3 className="font-bold mb-2">8. (下取自動車の賠償責任保険料及び自動車税)</h3>
          <p className="ml-4">当該下取自動車の未経過保険料及び自動車税期日未経過分は、その相当額を下取価格に含めるものとします。</p>
        </div>

        {/* 9. 下取自動車の引渡し時期と引取り費用 */}
        <div>
          <h3 className="font-bold mb-2">9. (下取自動車の引渡し時期と引取り費用)</h3>
          <p className="ml-4">
            注文者は当該下取自動車を、注文した自動車の引渡しと引替えに販売会社に引渡すものとします。また下取自動車が自走不能の場合は、下取諸費用の他にその引取り費用を販売会社に支払う事とします。
          </p>
        </div>

        {/* 10. 中古車の瑕疵担保責任 */}
        <div>
          <h3 className="font-bold mb-2">10. (中古車の瑕疵担保責任)</h3>
          <p className="ml-4">
            中古車の注文者は、価格ステッカー及び車輛状態説明書、もしくは整備明細書に表示の走行距離、前使用者の使用状況により生じる瑕疵について、一切異議のないものとします。保証書の交付を受けた場合はその範囲内の保証がなされるものとします。
          </p>
        </div>

        {/* 11. 納入の遅延 */}
        <div>
          <h3 className="font-bold mb-2">11. (納入の遅延)</h3>
          <p className="ml-4">
            メーカーのストライキあるいは港湾のストライキ、注文者の依頼に基づく修理・改造・架装等による遅れ、その他販売会社の責に帰し得ない事由により当該注文自動車の納入が遅れた場合、注文者はこれを認める事とします。
          </p>
        </div>

        {/* 12. 安全基準等による改造 */}
        <div>
          <h3 className="font-bold mb-2">12. (安全基準等による改造)</h3>
          <p className="ml-4">
            道路運送車輛法に基づく安全基準に適合する改善指導等により行われた改造の為、カタログ現車と一部異なる場合、注文者はこれを認めるものとします。
          </p>
        </div>

        {/* 13. 管轄合意 */}
        <div>
          <h3 className="font-bold mb-2">13. (管轄合意)</h3>
          <p className="ml-4">本契約により生ずる権利義務に関する訴訟について注文者は、販売会社所在の裁判所を第一審の裁判所とする事に同意するものとします。</p>
        </div>

        {/* 署名欄 */}
        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <p className="mb-8 font-medium">上記特約条項を読み確認、納得致しました。</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="mb-2 font-medium">署名：</p>
              <div className="border-b-2 border-black w-64 h-8"></div>
            </div>
            <div className="text-sm text-gray-600">
              <p>日付：{formatDate(data.estimateDate)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // メインページコンポーネント
  const MainPage = () => (
    <div
      className={`${className} bg-white p-8 max-w-7xl mx-auto pdf-page`}
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        minHeight: "100vh",
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
      data-document-type={documentType}
    >
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 border-b-4 border-black pb-6">{documentLabel}</h1>
        <div className="flex justify-between items-start mb-6">
          <div className="text-left text-sm">
            <div className="mb-1">番号：{data.estimateNumber}</div>
            <div>日付：{formatDate(data.estimateDate)}</div>
          </div>
        </div>
      </div>

      {/* 販売店情報とお客様情報を並列に配置 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* 右側：お客様情報（手書き用テーブル） */}
        <div>
          <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">お客様情報</div>
          <table className="w-full border-2 border-t-0 border-black text-sm">
            <tbody>
              <tr className="border-b border-black">
                <td className="p-3 w-1/3 bg-gray-100 font-medium border-r border-black">お客様氏名（買い主）</td>
                <td className="p-3 w-2/3">
                  <div className="h-6"></div>
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-3 bg-gray-100 font-medium border-r border-black">フリガナ</td>
                <td className="p-3">
                  <div className="h-6"></div>
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-3 bg-gray-100 font-medium border-r border-black">住所</td>
                <td className="p-3">
                  <div className="h-6"></div>
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-3 bg-gray-100 font-medium border-r border-black">生年月日</td>
                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-6"></div>
                    <span>年</span>
                    <div className="w-8 h-6"></div>
                    <span>月</span>
                    <div className="w-8 h-6"></div>
                    <span>日</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-3 bg-gray-100 font-medium border-r border-black">電話</td>
                <td className="p-3">
                  <div className="h-6"></div>
                </td>
              </tr>
              <tr className="border-b border-black">
                <td className="p-3 bg-gray-100 font-medium border-r border-black">携帯</td>
                <td className="p-3">
                  <div className="h-6"></div>
                </td>
              </tr>
              <tr>
                <td className="p-3 bg-gray-100 font-medium border-r border-black">備考</td>
                <td className="p-3">
                  <div className="h-6"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* 左側：販売店情報 */}
        <div>
          <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">販売店情報</div>
          <div className="border-2 border-t-0 border-black p-4 bg-gray-50">
            <div className="text-sm space-y-2">
              <div>
                <span className="font-medium">販売店名:</span> {data.dealerInfo.name}
              </div>
              <div>
                <span className="font-medium">担当者:</span> {data.dealerInfo.representative}
              </div>
              <div>
                <span className="font-medium">電話番号:</span> {data.dealerInfo.phone}
              </div>
              <div>
                <span className="font-medium">住所:</span> {data.dealerInfo.address}
              </div>
              <div>
                <span className="font-medium">Email:</span> {data.dealerInfo.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 見積車両情報 */}
      <div className="mb-6">
        <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">見積車両</div>
        <div className="border-2 border-t-0 border-black">
          <div className="flex">
            <div className="flex-1 border-r-2 border-black">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="p-3 w-1/4 bg-gray-100 font-medium border-r border-black">車名</td>
                    <td className="p-3 w-1/4 border-r border-black">
                      {data.estimateVehicle.maker} {data.estimateVehicle.name}
                    </td>
                    <td className="p-3 w-1/4 bg-gray-100 font-medium border-r border-black">グレード</td>
                    <td className="p-3 w-1/4">{data.estimateVehicle.grade || "-"}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-3 bg-gray-100 font-medium border-r border-black">型式</td>
                    <td className="p-3 border-r border-black">{data.estimateVehicle.model || "-"}</td>
                    <td className="p-3 bg-gray-100 font-medium border-r border-black">初度登録年月</td>
                    <td className="p-3">{data.estimateVehicle.year}年</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-3 bg-gray-100 font-medium border-r border-black">走行距離</td>
                    <td className="p-3 border-r border-black">{formatNumber(data.estimateVehicle.mileage)}km</td>
                    <td className="p-3 bg-gray-100 font-medium border-r border-black">修復歴</td>
                    <td className="p-3">{data.estimateVehicle.repairHistory ? "有" : "無"}</td>
                  </tr>
                  <tr>
                    <td className="p-3 bg-gray-100 font-medium border-r border-black">外装色</td>
                    <td className="p-3 border-r border-black" colSpan={1}>
                      {data.estimateVehicle.exteriorColor || "-"}
                    </td>
                    <td className="p-3 bg-gray-100 font-medium border-r border-black"></td>
                    <td className="p-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-52 p-4 text-center">
              <div className="text-2xl font-bold">¥{formatNumber(data.salesPrices.payment_total)}</div>
              <div className="text-xs mt-1">(内消費税 ¥{formatNumber(Math.floor(data.salesPrices.consumption_tax))})</div>
            </div>
          </div>
        </div>
      </div>

      {/* 価格詳細 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* 左側：価格内訳 + 下取車両情報 */}
        <div className="space-y-4">
          {/* 販売価格内訳 */}
          {/* 販売価格内訳 */}
          <div>
            <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">販売価格内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-3 w-1/4">車両本体価格</td>
                  <td className="p-3 w-1/4 text-right border-r border-black">¥{formatNumber(data.salesPrices.base_price)}</td>
                  <td className="p-3 w-1/4">値引き</td>
                  <td className="p-3 w-1/4 text-right">¥{formatNumber(data.salesPrices.discount)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">車検整備費用</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.salesPrices.inspection_fee)}</td>
                  <td className="p-3">付属品・特別仕様(A)</td>
                  <td className="p-3 text-right">¥{formatNumber(data.salesPrices.accessories_fee)}</td>
                </tr>
                <tr className="border-b border-black bg-gray-100">
                  <td className="p-3 font-bold" colSpan={2}>
                    車両販売価格①
                  </td>
                  <td className="p-3 text-right font-bold" colSpan={2}>
                    ¥{formatNumber(data.salesPrices.vehicle_price)}
                  </td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">税金・保険料(B)</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.salesPrices.tax_insurance)}</td>
                  <td className="p-3">預り法定費用(C)</td>
                  <td className="p-3 text-right">¥{formatNumber(data.salesPrices.legal_fee)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">手続代行費用(D)</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.salesPrices.processing_fee)}</td>
                  <td className="p-3">販売諸費用②</td>
                  <td className="p-3 text-right font-bold">¥{formatNumber(data.salesPrices.misc_fee)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">現金販売価格①＋②</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.salesPrices.total_price)}</td>
                  <td className="p-3">内消費税</td>
                  <td className="p-3 text-right">¥{formatNumber(data.salesPrices.consumption_tax)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">下取車価格</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.salesPrices.trade_in_price)}</td>
                  <td className="p-3">下取車残債</td>
                  <td className="p-3 text-right">¥{formatNumber(data.salesPrices.trade_in_debt)}</td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="p-3 font-bold" colSpan={2}>
                    販売価格
                  </td>
                  <td className="p-3 text-right font-bold" colSpan={2}>
                    ¥{formatNumber(data.salesPrices.payment_total)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 下取車両情報 */}
          <div>
            <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">下取車両情報</div>
            <table className="w-full border-2 border-t-0 border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-3 w-1/4">車名</td>
                  <td className="p-3 w-1/4 border-r border-black">{data.tradeInVehicle?.vehicle_name || ""}</td>
                  <td className="p-3 w-1/4">登録番号</td>
                  <td className="p-3 w-1/4">{data.tradeInVehicle?.registration_number || ""}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">走行距離</td>
                  <td className="p-3 border-r border-black">{data.tradeInVehicle?.mileage ? formatNumber(data.tradeInVehicle.mileage) + "km" : ""}</td>
                  <td className="p-3">初度登録年月</td>
                  <td className="p-3">{data.tradeInVehicle?.first_registration_date ? formatDate(data.tradeInVehicle.first_registration_date) : ""}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">車検満了日</td>
                  <td className="p-3 border-r border-black">
                    {data.tradeInVehicle?.inspection_expiry_date ? formatDate(data.tradeInVehicle.inspection_expiry_date) : ""}
                  </td>
                  <td className="p-3">車台番号</td>
                  <td className="p-3">{data.tradeInVehicle?.chassis_number || ""}</td>
                </tr>
                <tr>
                  <td className="p-3">外装色</td>
                  <td className="p-3 border-r border-black">{data.tradeInVehicle?.exterior_color || ""}</td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 右側：詳細内訳 */}
        <div className="space-y-4">
          {/* (A) 付属品・特別仕様 */}
          <div>
            <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">(A) 付属品・特別仕様 内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-sm">
              <thead>
                <tr className="bg-gray-100 border-b border-black">
                  <th className="p-3 text-left w-1/4">品名</th>
                  <th className="p-3 text-right w-1/4 border-r border-black">金額</th>
                  <th className="p-3 text-left w-1/4">品名</th>
                  <th className="p-3 text-right w-1/4">金額</th>
                </tr>
              </thead>
              <tbody>
                {data.accessories.length > 0 ? (
                  Array.from({ length: Math.ceil(data.accessories.length / 2) }).map((_, rowIndex) => {
                    const leftItem = data.accessories[rowIndex * 2];
                    const rightItem = data.accessories[rowIndex * 2 + 1];
                    return (
                      <tr key={rowIndex} className="border-b border-black">
                        <td className="p-3">{leftItem?.name || ""}</td>
                        <td className="p-3 text-right border-r border-black">{leftItem ? `¥${formatNumber(leftItem.price)}` : ""}</td>
                        <td className="p-3">{rightItem?.name || ""}</td>
                        <td className="p-3 text-right">{rightItem ? `¥${formatNumber(rightItem.price)}` : ""}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-3 text-center">
                      -
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* (B) 税金・保険料 */}
          <div>
            <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">(B) 税金・保険料 内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-3 w-1/4">自動車税</td>
                  <td className="p-3 w-1/4 text-right border-r border-black">¥{formatNumber(data.taxInsuranceFees.automobile_tax)}</td>
                  <td className="p-3 w-1/4">環境性能割</td>
                  <td className="p-3 w-1/4 text-right">¥{formatNumber(data.taxInsuranceFees.environmental_performance_tax)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">重量税</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.taxInsuranceFees.weight_tax)}</td>
                  <td className="p-3">自賠責保険料</td>
                  <td className="p-3 text-right">¥{formatNumber(data.taxInsuranceFees.liability_insurance_fee)}</td>
                </tr>
                <tr>
                  <td className="p-3">任意保険料</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.taxInsuranceFees.voluntary_insurance_fee)}</td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* (C) 預り法定費用 */}
          <div>
            <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">(C) 預り法定費用 内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-3 w-1/4">検査登録（印紙代）</td>
                  <td className="p-3 w-1/4 text-right border-r border-black">¥{formatNumber(data.legalFees.inspection_registration_stamp)}</td>
                  <td className="p-3 w-1/4">車庫証明（印紙代）</td>
                  <td className="p-3 w-1/4 text-right">¥{formatNumber(data.legalFees.parking_certificate_stamp)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">下取車手続・処分（印紙代）</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.legalFees.trade_in_stamp)}</td>
                  <td className="p-3">リサイクル預託金</td>
                  <td className="p-3 text-right">¥{formatNumber(data.legalFees.recycling_deposit)}</td>
                </tr>
                <tr>
                  <td className="p-3">その他非課税費用</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.legalFees.other_nontaxable)}</td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* (D) 手続代行費用 */}
          <div>
            <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">(D) 手続代行費用 内訳</div>
            <table className="w-full border-2 border-t-0 border-black text-sm">
              <tbody>
                <tr className="border-b border-black">
                  <td className="p-3 w-1/4">検査登録手続代行</td>
                  <td className="p-3 w-1/4 text-right border-r border-black">¥{formatNumber(data.processingFees.inspection_registration_fee)}</td>
                  <td className="p-3 w-1/4">車庫証明手続代行</td>
                  <td className="p-3 w-1/4 text-right">¥{formatNumber(data.processingFees.parking_certificate_fee)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">下取車手続・処分手続代行</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.processingFees.trade_in_processing_fee)}</td>
                  <td className="p-3">下取車査定料</td>
                  <td className="p-3 text-right">¥{formatNumber(data.processingFees.trade_in_assessment_fee)}</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-3">リサイクル管理費用</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.processingFees.recycling_management_fee)}</td>
                  <td className="p-3">納車費用</td>
                  <td className="p-3 text-right">¥{formatNumber(data.processingFees.delivery_fee)}</td>
                </tr>
                <tr>
                  <td className="p-3">その他費用</td>
                  <td className="p-3 text-right border-r border-black">¥{formatNumber(data.processingFees.other_fees)}</td>
                  <td className="p-3"></td>
                  <td className="p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ローン計算と振り込み口座を並列に配置 */}
      {(data.loanCalculation || data.dealerInfo.bankAccount) && (
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* 左側：ローン計算 */}
          <div>
            {data.loanCalculation && (
              <>
                <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">ローン計算</div>
                <table className="w-full border-2 border-t-0 border-black text-sm">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-3 w-1/4">頭金</td>
                      <td className="p-3 text-right w-1/4 border-r border-black">
                        {data.loanCalculation ? `¥${formatNumber(data.loanCalculation.down_payment)}` : ""}
                      </td>
                      <td className="p-3 w-1/4">支払回数</td>
                      <td className="p-3 text-right w-1/4">{data.loanCalculation ? `${formatNumber(data.loanCalculation.payment_count)}回` : ""}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-3">現金・割賦元金</td>
                      <td className="p-3 text-right border-r border-black">{data.loanCalculation ? `¥${formatNumber(data.loanCalculation.principal)}` : ""}</td>
                      <td className="p-3">支払期間</td>
                      <td className="p-3 text-right">{data.loanCalculation ? `${formatNumber(data.loanCalculation.payment_period)}年` : ""}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-3">分割払手数料</td>
                      <td className="p-3 text-right border-r border-black">
                        {data.loanCalculation ? `¥${formatNumber(data.loanCalculation.interest_fee)}` : ""}
                      </td>
                      <td className="p-3">初回支払額</td>
                      <td className="p-3 text-right">{data.loanCalculation ? `¥${formatNumber(data.loanCalculation.first_payment)}` : ""}</td>
                    </tr>
                    <tr className={`${data.loanCalculation?.bonus_amount > 0 ? "border-b border-black" : ""}`}>
                      <td className="p-3">分割支払金合計</td>
                      <td className="p-3 text-right border-r border-black">
                        {data.loanCalculation ? `¥${formatNumber(data.loanCalculation.total_payment)}` : ""}
                      </td>
                      <td className="p-3">２回目以降支払額</td>
                      <td className="p-3 text-right">{data.loanCalculation ? `¥${formatNumber(data.loanCalculation.monthly_payment)}` : ""}</td>
                    </tr>
                    {data.loanCalculation?.bonus_amount > 0 && (
                      <tr>
                        <td className="p-3">ボーナス加算月</td>
                        <td className="p-3 text-right border-r border-black">{data.loanCalculation.bonus_months.join("・")}月</td>
                        <td className="p-3">ボーナス加算額</td>
                        <td className="p-3 text-right">¥{formatNumber(data.loanCalculation.bonus_amount)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>

          {/* 右側：振り込み口座 */}
          <div>
            {data.dealerInfo.bankAccount && (
              <>
                <div className="bg-gray-200 px-4 py-2 font-bold border-2 border-black text-lg">振り込み口座</div>
                <table className="w-full border-2 border-t-0 border-black text-sm">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="p-3 w-1/3 bg-gray-100 font-medium border-r border-black">銀行名</td>
                      <td className="p-3 w-2/3">{data.dealerInfo.bankAccount?.bankName || ""}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-3 bg-gray-100 font-medium border-r border-black">支店名</td>
                      <td className="p-3">{data.dealerInfo.bankAccount?.branchName || ""}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-3 bg-gray-100 font-medium border-r border-black">口座種別</td>
                      <td className="p-3">{data.dealerInfo.bankAccount?.accountType || ""}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-3 bg-gray-100 font-medium border-r border-black">口座番号</td>
                      <td className="p-3">{data.dealerInfo.bankAccount?.accountNumber || ""}</td>
                    </tr>
                    <tr>
                      <td className="p-3 bg-gray-100 font-medium border-r border-black">口座名義</td>
                      <td className="p-3">{data.dealerInfo.bankAccount?.accountHolder || ""}</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pdf-container" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      {/* メインページ */}
      <MainPage />

      {/* 注文書の場合のみ特約条項ページを追加 */}
      {documentType === "order" && <SpecialTermsPage />}
    </div>
  );
};

export default EstimatePDFTemplate;
